import React, { useState } from "react";
import { muonSachApiCaller } from "../../../utils/bookApiCaller";
import MuonSachItem from "../../../components/muonSachItem/muonSachItem";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LBBPage = () => {
  const [muonSachL, setMuonSachL] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maDocGia, setMaDocGia] = useState("");
  //   if (loading) {
  //     setLoading(false);
  //   }
  console.log(muonSachL);
  // const  componentDidMount() {
  //     bookApiCaller("", "get", null).then((res) => {
  //       this.setState({
  //         books: res.data,
  //       });
  //       this.loading = false;
  //     });
  //   }
  const getData = async () => {
    await muonSachApiCaller("", "get", null)
      .then((res) => {
        if (res.status === 200) {
          //   docGia["docGia"] = res.data;
          setMuonSachL(res.data);
          setLoading(false);
        }
      })
      .catch((er) => {
        console.log("no data");
      });
  };
  if (loading) {
    getData();
  }
  const updateDaTra = async (maDocGia, maSach, ngayTra) => {
    const update = {
      maDocGia: maDocGia,
      maSach: maSach,
      ngayTra: ngayTra ? ngayTra : " ",
    };
    await muonSachApiCaller("", "patch", update)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Ngày trả đã định cho độc giả " + maDocGia);
          const cloneMuonSL = [...muonSachL];
          const index = cloneMuonSL.findIndex(
            (e) => e.maDocGia === maDocGia && e.maSach === maSach
          );
          cloneMuonSL[index].ngayTra = update.ngayTra;
          setMuonSachL(cloneMuonSL);
        }
      })
      .catch((err) => {
        toast.error("Lỗi không thể định ngày trả");
      });
  };
  const onDelete = (maDocGia, maSach) => {
    const thisMuonSachL = [...muonSachL];
    // const ma = { maSach: maSach };
    muonSachApiCaller("", "delete", {
      maDocGia: maDocGia,
      maSach: maSach,
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.success(
            "Xóa thông tin mượn sách của độc giả " +
              maDocGia +
              " và sách " +
              maSach +
              " thành công"
          );
          var index = -1;
          index = thisMuonSachL.findIndex(
            (obj) => obj.maDocGia === maDocGia && obj.maSach === maSach
          );
          if (index >= 0) {
            //   const updatedDocGia = [...docGia];
            thisMuonSachL.splice(index, 1);
            setMuonSachL(thisMuonSachL);
            console.log(thisMuonSachL);
            //   //   setDocGia([]);
            //   setDocGia(thisDocGia);
            //   setLoading(false);
          }
        }
      })
      .catch((err) => {
        toast.error("lỗi xóa thông tin");
      });
  };
  const showMuonSachL = () => {
    var result = null;
    try {
      if (muonSachL.length > 0) {
        result = muonSachL.map((muonSach, index) => {
          return (
            <MuonSachItem
              key={index}
              muonSachInf={muonSach}
              index={index}
              onDelete={onDelete}
              updateDaTra={updateDaTra}
            />
          );
        });
      }
    } catch (error) {}
    return result;
  };
  const checkMaDocGia = () => {
    let count = 0;
    const inputArray = Array.from(maDocGia);
    inputArray.forEach((e) => {
      if (e === " ") {
        count = count + 1;
      }
    });
    if (count === maDocGia.length) {
      return true;
    } else {
      return false;
    }
  };
  const checkKeyDown = (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      e.preventDefault();
      TimSach();
    }
  };
  const TimSach = async () => {
    if (!checkMaDocGia()) {
      await muonSachApiCaller("getMaDocGa/", "post", { maDocGia: maDocGia })
        .then((res) => {
          if (res.status === 200) {
            //   docGia["docGia"] = res.data;
            setMuonSachL(res.data);
          }
        })
        .catch((er) => {
          toast.error("Không tìm thấy mã độc giả");
        });
    } else {
      getData();
      toast.error("Mã độc giả không hợp lệ để tìm kiếm");
    }
  };
  return (
    <div>
      <ToastContainer />
      <div className="container">
        <div className="container mt-10 w90" style={{ border: "solid" }}>
          <div className="form-floating mb-3 w-100">
            <NavLink className="btn btn-primary w-100 mt-3" to="/borrowBook">
              Thêm thông tin mượn sách
            </NavLink>
          </div>
          <div className="d-flex mb-3">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Tìm kiếm mã độc giả"
              aria-label="Search"
              value={maDocGia}
              onKeyUp={(e) => checkKeyDown(e)}
              onChange={(e) => setMaDocGia(e.target.value)}
            />
            <button
              className="btn btn-success me-2"
              type="button"
              onClick={() => TimSach()}
            >
              Tìm
            </button>
          </div>
          <table
            className="table table-primary w-100"
            style={{ fontSize: "auto" }}
          >
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Mã Độc Giả</th>
                <th scope="col">Mã Sách</th>
                <th scope="col">Ngày Mượn</th>
                <th scope="col">Ngày Trả</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>{showMuonSachL()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LBBPage;
