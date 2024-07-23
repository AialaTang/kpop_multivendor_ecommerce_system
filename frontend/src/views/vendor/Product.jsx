import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Product() {
  const [products, setProducts] = useState();

  const userData = UserData();

  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1500,
    timeProgressBar: true,
  });

  useEffect(() => {
    apiInstance.get(`vendor/products/${userData?.vendor_id}/`).then((res) => {
      setProducts(res.data);
    });
  }, []);

  const handleDeleteProduct = async (productPid) => {
    await apiInstance.delete(
      `vendor-delete-product/${userData?.vendor_id}/${productPid}/`
    );
    apiInstance.get(`vendor/products/${userData?.vendor_id}/`).then((res) => {
      setProducts(res.data);
    });
    Toast.fire({
      icon: "success",
      title: "Product Deleted",
    });
  };

  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="row mb-3 container">
            <div className="col-lg-12" style={{ marginBottom: 100 }}>
              <div className="tab-content">
                <br />
                <div role="tabpanel" className="tab-pane active" id="home1">
                  <h4 mb-3>Products</h4>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Orders</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products?.map((p, index) => (
                        <tr>
                          <th scope="row">
                            <img
                              src={p.image}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                              alt=""
                            />
                          </th>
                          <td>{p.title}</td>
                          <td>${p.price}</td>
                          <td>{p.stock_qty}</td>
                          <td>{p.orders}</td>
                          <td>{p.status.toUpperCase()}</td>
                          <td>
                            <Link
                              to={`/detail/${p.slug}/`}
                              className="btn btn-primary mb-1 me-2"
                            >
                              <i className="fas fa-eye" />
                            </Link>
                            <Link
                              to={`/vendor/product/update/${p.pid}/`}
                              className="btn btn-success mb-1 me-2"
                            >
                              <i className="fas fa-edit" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(p.pid)}
                              className="btn btn-danger mb-1"
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div role="tabpanel" className="tab-pane" id="profile1">
                  <h4>Orders</h4>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">#Order ID</th>
                        <th scope="col">Total</th>
                        <th scope="col">Payment Status</th>
                        <th scope="col">Delivery Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">#trytrr</th>
                        <td>$100.90</td>
                        <td>Paid</td>
                        <td>Shipped</td>
                        <td>20th June, 2023</td>
                        <td>
                          <a href="" className="btn btn-primary mb-1">
                            <i className="fas fa-eye" />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">#hjkjhkhk</th>
                        <td>$210.90</td>
                        <td>Pending</td>
                        <td>Not Shipped</td>
                        <td>21th June, 2023</td>
                        <td>
                          <a href="" className="btn btn-primary mb-1">
                            <i className="fas fa-eye" />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">#retrey</th>
                        <td>$260.90</td>
                        <td>Failed</td>
                        <td>Not Shipped</td>
                        <td>25th June, 2023</td>
                        <td>
                          <a href="" className="btn btn-primary mb-1">
                            <i className="fas fa-eye" />
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
