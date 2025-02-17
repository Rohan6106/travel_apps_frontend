// import "./Auth.css";
// import { validateNumber, validatePassword } from "../../utils";
// import { loginHandler } from "../../services";
// import { useAuth, useAlert } from "../../context";

// let isNumberValid, isPasswordValid;

// export const AuthLogin = () => {
//   const { authDispatch, number, password } = useAuth();
//   const { setAlert } = useAlert();

//   const handleNumberChange = (event) => {
//     isNumberValid = validateNumber(event.target.value);
//     if (isNumberValid) {
//       console.log("Valid Input");
//       authDispatch({
//         type: "NUMBER",
//         payload: event.target.value,
//       });
//     } else {
//       console.log("Invalid Number");
//     }
//   };

//   const handlePasswordChange = (event) => {
//     isPasswordValid = validatePassword(event.target.value);
//     if (isPasswordValid) {
//       console.log("Valid Input");
//       authDispatch({
//         type: "PASSWORD",
//         payload: event.target.value,
//       });
//     } else {
//       console.log("Invalid Password");
//     }
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     if (isNumberValid && isPasswordValid) {
//       const { accessToken, username } = await loginHandler(number, password, setAlert);
//       authDispatch({
//         type: "SET_ACCESS_TOKEN",
//         payload: accessToken,
//       });
//       authDispatch({
//         type: "SET_USER_NAME",
//         payload: username,
//       });

//     }
//     authDispatch({
//       type: "CLEAR_USER_DATA",
//     });
//     authDispatch({
//       type: "SHOW_AUTH_MODAL",
//     });
//   };

//   const handleTestCredentialsClick = async () => {
//     const { accessToken, username } = await loginHandler(
//       7878787878,
//       "Abcd@1234",
//       setAlert
//     );
//     authDispatch({
//       type: "SET_ACCESS_TOKEN",
//       payload: accessToken,
//     });
//     authDispatch({
//       type: "SET_USER_NAME",
//       payload: username,
//     });
//     authDispatch({
//       type: "CLEAR_USER_DATA",
//     });
//     authDispatch({
//       type: "SHOW_AUTH_MODAL",
//     });
//   };

//   return (
//     <div className="auth-container">
//       <form onSubmit={handleFormSubmit}>
//         <div className="d-flex direction-column lb-in-container">
//           <label className="auth-label">
//             Mobile Number <span className="asterisk">*</span>{" "}
//           </label>
//           <input
//             defaultValue={number}
//             type="number"
//             className="auth-input"
//             maxLength="10"
//             placeholder="Enter Mobile Number"
//             required
//             onChange={handleNumberChange}
//           />
//         </div>
//         <div className="d-flex direction-column lb-in-container">
//           <label className="auth-label">
//             Password <span className="asterisk">*</span>{" "}
//           </label>
//           <input
//             defaultValue={password}
//             className="auth-input"
//             placeholder="Enter Password"
//             type="password"
//             required
//             onChange={handlePasswordChange}
//           />
//         </div>
//         <div>
//           <button className="button btn-primary btn-login cursor">Login</button>
//         </div>
//       </form>
//       <div className="cta">
//         <button
//           className="button btn-outline-primary cursor-pointer"
//           onClick={handleTestCredentialsClick}
//         >
//           Login with Test Credentials
//         </button>
//       </div>
//     </div>
//   );
// };

import "./Auth.css";
import { validateNumber, validatePassword } from "../../utils";
import { loginHandler } from "../../services";
import { useAuth, useAlert } from "../../context";
import { useState } from "react";

export const AuthLogin = () => {
  const { authDispatch, number, password } = useAuth();
  const { setAlert } = useAlert();

  // Local state for validation
  const [isNumberValid, setIsNumberValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handleNumberChange = (event) => {
    const isValid = validateNumber(event.target.value);
    setIsNumberValid(isValid);

    if (isValid) {
      console.log("Valid Number");
      authDispatch({
        type: "NUMBER",
        payload: event.target.value,
      });
    } else {
      console.log("Invalid Number");
    }
  };

  const handlePasswordChange = (event) => {
    const isValid = validatePassword(event.target.value);
    setIsPasswordValid(isValid);

    if (isValid) {
      console.log("Valid Password");
      authDispatch({
        type: "PASSWORD",
        payload: event.target.value,
      });
    } else {
      console.log("Invalid Password");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isNumberValid || !isPasswordValid) {
      setAlert({
        type: "error",
        message: "Invalid inputs. Please check again.",
      });
      return;
    }

    try {
      const data = await loginHandler(number, password, setAlert);

      if (data?.accessToken) {
        authDispatch({ type: "SET_ACCESS_TOKEN", payload: data.accessToken });
        authDispatch({ type: "SET_USER_NAME", payload: data.username });

        // Clear user data only on successful login
        authDispatch({ type: "CLEAR_USER_DATA" });
        authDispatch({ type: "SHOW_AUTH_MODAL" });
      } else {
        setAlert({ type: "error", message: "Login failed. Please try again." });
      }
    } catch (error) {
      setAlert({ type: "error", message: "An error occurred during login." });
    }
  };

  const handleTestCredentialsClick = async () => {
    try {
      const data = await loginHandler(7878787878, "Abcd@1234", setAlert);

      if (data?.accessToken) {
        authDispatch({ type: "SET_ACCESS_TOKEN", payload: data.accessToken });
        authDispatch({ type: "SET_USER_NAME", payload: data.username });

        authDispatch({ type: "CLEAR_USER_DATA" });
        authDispatch({ type: "SHOW_AUTH_MODAL" });
      } else {
        setAlert({ type: "error", message: "Test login failed." });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred while testing login.",
      });
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleFormSubmit}>
        <div className="d-flex direction-column lb-in-container">
          <label className="auth-label">
            Mobile Number <span className="asterisk">*</span>{" "}
          </label>
          <input
            defaultValue={number}
            type="tel" // Changed from number to tel to allow better validation
            className="auth-input"
            pattern="[0-9]{10}" // Ensures exactly 10 digits
            placeholder="Enter Mobile Number"
            required
            onChange={handleNumberChange}
          />
        </div>
        <div className="d-flex direction-column lb-in-container">
          <label className="auth-label">
            Password <span className="asterisk">*</span>{" "}
          </label>
          <input
            defaultValue={password}
            className="auth-input"
            placeholder="Enter Password"
            type="password"
            required
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <button className="button btn-primary btn-login cursor">Login</button>
        </div>
      </form>
      <div className="cta">
        <button
          className="button btn-outline-primary cursor-pointer"
          onClick={handleTestCredentialsClick}
        >
          Login with Test Credentials
        </button>
      </div>
    </div>
  );
};
