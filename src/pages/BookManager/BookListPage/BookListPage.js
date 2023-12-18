import React, { Component } from "react";
import bookApiCaller from "../../../utils/bookApiCaller";
import BookItemTable from "../../../components/BookItemTable/BookItemTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import "./BookListPage.scss";
class BookListPage extends Component {
  state = {
    books: [],
    page: 0,
    totalPage: 0,
  };
  componentDidMount() {
    bookApiCaller("count/", "get", null)
      .then((res) => {
        this.setState({
          totalPage: Math.floor(Number(res.data.count) / 4) + 1,
        });
      })
      .catch((err) => {});
    this.getSach();
  }
  getSach = async () => {
    await bookApiCaller("page/", "post", { limit: 4, page: this.state.page })
      .then((res) => {
        this.setState({
          books: res.data,
        });
        this.loading = false;
      })
      .catch((err) => {});
  };
  increasePageNum = async () => {
    if (this.state.page + 1 < this.state.totalPage) {
      await this.setState({
        page: Number(this.state.page) + 1,
      });
      await this.getSach();
    }
  };
  decreasePageNum = async () => {
    if (this.state.page > 0) {
      await this.setState({
        page: Number(this.state.page) - 1,
      });
      await this.getSach();
    }
  };
  showBookItem = (books) => {
    var result = null;
    if (this.state.books.length > 0) {
      result = this.state.books.map((book, index) => {
        return (
          <BookItemTable
            key={index}
            book={book}
            index={index}
            onDelete={this.onDelete}
          />
        );
      });
    }
    return result;
  };
  onDelete = (maSach) => {
    var { books } = this.state;
    const ma = { maSach: maSach };
    bookApiCaller("", "delete", ma).then((res) => {
      console.log(res);
      if (res.status === 200) {
        toast.success("Xóa sách mã " + maSach + " thành công");
        var index = books.findIndex((obj) => obj.maSach === maSach);
        if (index !== -1) {
          books.splice(index, 1);
          this.setState({
            books: books,
          });
        }
      }
    });
  };
  render() {
    return (
      <div>
        <ToastContainer />
        <div className="container">
          <div className="container mt-10 w90" style={{ border: "solid" }}>
            <div className="form-floating mb-3 w-100">
              <NavLink className="btn btn-primary w-100 mt-3" to="/addBook">
                Thêm Sách
              </NavLink>
            </div>
            <table
              className="table table-primary w-100"
              style={{ fontSize: "auto" }}
            >
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Mã Sách</th>
                  <th scope="col">Tên Sách</th>
                  <th scope="col">Tác Giả</th>
                  <th scope="col">Số Trang</th>
                  <th scope="col">Tóm Tắt</th>
                  <th scope="col">NXB</th>
                  <th scope="col">Hình ảnh</th>
                  <th scope="col">Hành động</th>
                </tr>
              </thead>
              <tbody>{this.showBookItem()}</tbody>
            </table>
            <button
              className="btn btn-primary mt-3"
              style={{ margin: "3px" }}
              onClick={() => this.decreasePageNum()}
            >
              {"<"}
            </button>
            <button className="btn btn-primary mt-3" style={{ margin: "3px" }}>
              Trang {this.state.page + 1 + "/" + this.state.totalPage}
            </button>
            <button
              className="btn btn-primary mt-3"
              style={{ margin: "3px" }}
              onClick={() => this.increasePageNum()}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default BookListPage;
