import BeforeLoginAccount from "../components/BeforeLoginAccount";
import AfterLoginAccount from "../components/AfterLoginAccount";

const Account = () => {
  // check if token exists
  const isLoggedIn = localStorage.getItem("token") ? true : false;

  return (
    <>
      {isLoggedIn ? <AfterLoginAccount /> : <BeforeLoginAccount />}
    </>
  );
};

export default Account;
