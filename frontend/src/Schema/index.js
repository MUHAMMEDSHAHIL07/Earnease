import * as Yup from "yup";
export const SignupSchema = Yup.object({
  name: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  phonenumber: Yup.string().min(10, "enter a valid number").required("Phone number is required"),
//   cpassword: Yup.string().oneOf([Yup.ref("password")], "Passwords do not match").required("Confirm Password is required"),
});

export const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required")
});

