import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Swal from "sweetalert2";

function CreatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const otp = searchParams.get("otp");
  const uidb64 = searchParams.get("uidb64");
  const reset_token = searchParams.get("reset_token");

  const handlePasswordSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "danger",
        title: "Password Does Not Match",
      });
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append("password", password);
      formdata.append("otp", otp);
      formdata.append("reset_token", reset_token);
      formdata.append("uidb64", uidb64);

      try {
        await apiInstance
          .post(`user/password-change/`, formdata)
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Password Changed Successfully",
            });
            navigate("/login");
            setIsLoading(false);
          });
      } catch (error) {
        Swal.fire({
          icon: "danger",
          title: "Error",
          text: "An error occured while tring to change the password",
        });
        setIsLoading(false);
        console.log(error);
      }
    }
  };

  return (
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
                        <form onSubmit={handlePasswordSubmit}>
                          {/* Email input */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Password
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              name="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              name="confirmPassword"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                          </div>
                          {isLoading === true ? (
                            <button disabled className="btn btn-primary w-100">
                              <span className="mr-2">Processing...</span>
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary w-100"
                              type="submit"
                            >
                              <span className="mr-2">Save Password</span>
                              <i className="fas fa-check-circle" />
                            </button>
                          )}

                          <div className="text-center">
                            <p className="mt-4">
                              Want to sign in?
                              <Link to="/login">Login</Link>
                            </p>
                            <p className="mt-0"></p>
                          </div>
                        </form>
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
  );
}

export default CreatePassword;
