import { useState } from "react";
import apiInstance from "../../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await apiInstance.get(`user/password-reset/${email}/`).then((res) => {
        Swal.fire({
          icon: "success",
          title: "An Email Has been Sent to you",
        });

        setIsLoading(false);
      });
    } catch (error) {
      Swal.fire({
        icon: "danger",
        title: "Email Does Not Exists",
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
        <div className="container">
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4">
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <div>
                          {/* Email input */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="loginName"
                              className="form-control"
                              name="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          {isLoading === true ? (
                            <button disable className="btn btn-primary w-100">
                              <span className="mr-2">Processing...</span>
                            </button>
                          ) : (
                            <button
                              onClick={handleSubmit}
                              className="btn btn-primary w-100"
                              type="button"
                            >
                              <span className="mr-2">Send Email </span>
                              <i className="fas fa-paper-plane" />
                            </button>
                          )}

                          <div className="text-center">
                            <p className="mt-4">
                              Want to sign in?
                              <Link to="/login">Login</Link>
                            </p>
                            <p className="mt-0"></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
