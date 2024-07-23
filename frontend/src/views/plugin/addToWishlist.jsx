import apiInstance from "../../utils/axios";

import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timeProgressBar: true,
});

export const addToWishlist = async (product_id, user_id) => {
  const formdata = new FormData();

  formdata.append("product_id", product_id);
  formdata.append("user_id", user_id);
  console.log(formdata);

  const response = await apiInstance.post(
    `customer/wishlist/<user_id>/`,
    formdata
  );
  Toast.fire({
    icon: "success",
    title: response.data.message,
  });
};
