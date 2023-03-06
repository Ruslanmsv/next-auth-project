import { useRef } from "react";

import classes from "./profile-form.module.css";

function ProfileForm() {
  const newPasswordInputRef = useRef();
  const oldPasswordInputRef = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;
    const enteredOldPassword = oldPasswordInputRef.current.value;

    // optional: Add validation

    // send data to API
    const response = await fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify({
        newPassword: enteredNewPassword,
        oldPassword: enteredOldPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordInputRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
