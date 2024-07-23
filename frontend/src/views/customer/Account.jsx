import { React, useState, useEffect } from "react";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

function Account() {
  const [profile, setProfile] = useState({});

  const userData = UserData();

  useEffect(() => {
    apiInstance.get(`user/profile/${userData?.user_id}/`).then((res) => {
      setProfile(res.data);
    });
  }, []);

  return (
    <main className="mt-5">
      <div className="container">
        <section className="">
          <div className="row">
            <Sidebar />
            <div className="col-lg-9 mt-1">
              <main className="mb-5" style={{}}>
                <div className="container px-4 mt-3">
                  <section className="">
                    <div className="row rounded shadow p-3">
                      <h2>Hi {profile.full_name}, </h2>
                      <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                        From your account dashboard. you can easily check &amp;
                        view your <Link to="/customer/orders/">orders</Link>,
                        <Link to={"/customer/settings/"}> Edit Account</Link>
                      </div>
                    </div>
                  </section>
                </div>
              </main>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Account;
