import axios from "axios";
// https://travel-app-2mth.onrender.com/api/auth/register
export const signupHandler = async (
  username,
  number,
  email,
  password,
  setAlert
) => {
  try {console.log(username,
    number,
    email,
    password,
    )
    const data = await axios.post(
      "https://travel-app-backend-1-4ltc.onrender.com/api/auth/register",
      {
        username: username,
        number: number,
        email: email,
        password: password,
      }
    );
    console.log("Signed Up");
    console.log(data);
    setAlert({
      open: true,
      message: `Account Created:: username - ${username}`,
      type: "success",
    });
  } catch (err) {
    console.log("error adding user to database");
  }
};
