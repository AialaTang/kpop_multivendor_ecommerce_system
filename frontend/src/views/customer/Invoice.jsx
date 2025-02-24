import { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import { useParams } from "react-router-dom";

function Invoice() {
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);

  const userData = UserData();
  const param = useParams();

  useEffect(() => {
    apiInstance
      .get(`customer/order/${userData?.user_id}/${param.order_oid}/`)
      .then((res) => {
        setOrder(res.data);
        setOrderItems(res.data.orderitem);
      });
  }, []);

  return (
    <div>
      <>
        <div className="row d-flex justify-content-center p-2">
          <div className="receipt-main col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3">
            <div className="d-flex justify-content-between">
              <div className="row">
                <div className="receipt-header">
                  <div className="col-xs-6 col-sm-6 col-md-6">
                    <div className="receipt-left">
                      <img
                        className="img-responsive"
                        alt="iamgurdeeposahan"
                        src="https://media.licdn.com/dms/image/D5603AQF_dNRMTdUQRg/profile-displayphoto-shrink_800_800/0/1718222287166?e=1727308800&v=beta&t=zG8vaA-3XG_CvnHRiW5pM12baMQlnMcIN0aXReX16jQ"
                        style={{ width: 71, borderRadius: 43 }}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12 text-left">
                    <div className="receipt-right">
                      <h5 className="margin-top-10">
                        Shuo Tang<span className="text-warning">.</span>
                      </h5>
                      <p>
                        <i className="fa fa-phone" /> +61 459 578 513
                      </p>
                      <p>
                        <i className="fa fa-envelope" /> aialawjy@gmail.com
                      </p>
                      <p>
                        <i className="fa fa-location-arrow" /> Sydney
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="receipt-header receipt-header-mid">
                  <div className="col-xs-12 col-sm-12 col-md-12 text-left">
                    <div className="receipt-right">
                      <h5>Customer Details</h5>
                      <p>
                        <b>
                          <i className="fa fa-user" />
                        </b>
                        {order?.buyer?.full_name}
                      </p>
                      <p>
                        <b>
                          <i className="fa fa-envelope" />
                        </b>
                        {order?.email}
                      </p>
                      <p>
                        <b>
                          <i className="fa fa-phone" />
                        </b>
                        {order?.mobile}
                      </p>
                    </div>
                  </div>
                  <br />
                  <div className="col-xs-12 col-sm-12 col-md-12">
                    <div className="receipt-left">
                      <h6>INVOICE ID #{order.oid}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Sub Total</th>
                    <th>Discount</th>
                  </tr>
                </thead>

                <tbody>
                  {orderItems.map((o, index) => (
                    <tr>
                      <td className="col-md-5">{o.product?.title}</td>
                      <td className="col-md-2">${o.price}</td>
                      <td className="col-md-2">{o.qty}</td>
                      <td className="col-md-2">${o.sub_total}</td>
                      <td className="col-md-2">${o.saved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="row">
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 d-flex justify-content-start"></div>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 d-flex justify-content-end">
                  <div className="receipt-right">
                    <h5>Summary</h5>
                    <p className="mb-2">
                      <b>Sub Total: </b>${order?.sub_total}
                    </p>
                    <p className="mb-2">
                      <b>Shipping: </b>${order?.shipping_amount}
                    </p>
                    <p className="mb-2">
                      <b>Tax: </b>${order?.tax_fee}
                    </p>
                    <p className="mb-2">
                      <b>Service Fee: </b>${order?.service_fee}
                    </p>
                    <br />
                    <p className="mb-2">
                      <b>Total: </b>${order?.total}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-center align-items-center">
              <button id="printButton" className="btn btn-dark">
                Print <i className="fas fa-print" />
              </button>
            </div>
          </div>
        </div>
        {/* Print Windows */}
      </>
    </div>
  );
}

export default Invoice;
