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

export const JobPostSchema = Yup.object({
  title: Yup.string()
    .min(8, "Job title must be at least 8 characters")
    .required("Job title is required"),
  Description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Job description is required"),
  Location: Yup.string().required("Location is required"),
  Salary: Yup.number()
    .typeError("Salary must be a number")
    .positive("Salary must be positive")
    .required("Salary is required"),
  Category: Yup.string().required("Category is required"),
  Skills: Yup.string().required("Skills are required"),
  WorkHour: Yup.string().required("Work hours are required"),
  Gender: Yup.string().required("Gender preference is required"),
});