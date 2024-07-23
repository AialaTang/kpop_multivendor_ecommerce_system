import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import Sidebar from "./Sidebar";

function Orders() {
  const [orders, setOrders] = useState(null);

  const userData = UserData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiInstance.get(
          `vendor/orders/${userData?.vendor_id}/`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterOrders = async (filter) => {
    const response = await apiInstance.get(
      `vendor/order/filter/${userData?.vendor_id}?filter=${filter}`
    );
    setOrders(response.data);
  };

  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main">
          <div className="mb-3 mt-3" style={{ marginBottom: 300 }}>
            <div>
              <h4>
                <i class="bi bi-cart-check-fill"></i> All Orders{" "}
              </h4>
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
                  type="button"
                  id="dropdownMenuClickable"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Filter <i className="fas fa-sliders"></i>
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuClickable"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrders("paid")}
                      href="#"
                    >
                      Payment Status: Paid
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrders("pending")}
                      href="#"
                    >
                      Payment Status: Pending
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrders("processing")}
                      href="#"
                    >
                      Payment Status: Processing
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrders("cancelled")}
                      href="#"
                    >
                      Payment Status: Cancelled
                    </a>
                  </li>
                  <hr />
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrders("latest")}
                      href="#"
                    >
                      Date: Latest
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrders("oldest")}
                      href="#"
                    >
                      Date: Oldest
                    </a>
                  </li>
                  <hr />
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrders("Pending")}
                      href="#"
                    >
                      Order Status: Pending
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrders("Fulfilled")}
                      href="#"
                    >
                      Order Status: Fulfilled
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleFilterOrders("Cancelled")}
                      href="#"
                    >
                      Order Status: Cancelled
                    </a>
                  </li>
                </ul>
              </div>
              <table className="table">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Total</th>
                    <th scope="col">Payment Status</th>
                    <th scope="col">Order Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((o, index) => (
                    <tr key={index}>
                      <th scope="row">#{o.oid}</th>
                      <td>{o.total}</td>
                      <td>{o.payment_status.toUpperCase()}</td>
                      <td>{o.order_status.toUpperCase()}</td>
                      <td>{moment(o.date).format("MMM DD,YYYY")}</td>
                      <td>
                        <Link
                          to={`/vendor/orders/${o.oid}/`}
                          className="btn btn-primary mb-1"
                        >
                          <i className="fas fa-eye" />
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {orders < 1 && <h5 className="mt-4 p-3">No orders yet</h5>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
