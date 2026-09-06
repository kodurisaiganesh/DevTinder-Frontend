import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

function ProfileForm({ user }) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [address, setAddress] = useState(user?.address || "");
  const [skills, setSkills] = useState(user?.Skills?.join(", ") || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [bio, setBio] = useState(user?.Bio || "");
  const [age, setAge] = useState(user?.age || "");
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const SubmitProfile = async (event) => {
    event.preventDefault();

    setError("");
    try {
      const res = await axios.patch(
        "http://localhost:3000/profile/edit",
        {
          firstName,
          lastName,
          phone,
          gender,
          address,
          Skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== ""),
          photoUrl,
          Bio: bio,
          age,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(res.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      const message = err.response?.data || err.message;
      console.error("Error:", message);
      setError(typeof message === "string" ? message : "Failed to update profile");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 my-10 md:flex-row md:items-start md:justify-center">

      {/* Edit Profile Form */}
      <div className="card card-border bg-base-100 w-96">
        <div className="card-body">

          <h2 className="card-title">Edit Profile</h2>

          <form onSubmit={SubmitProfile} noValidate>

            {/* First Name */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                First Name
              </legend>

              <input
                type="text"
                className="input"
                placeholder="Enter first name"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
              />
            </fieldset>

            {/* Last Name */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Last Name
              </legend>

              <input
                type="text"
                className="input"
                placeholder="Enter last name"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
              />
            </fieldset>

            {/* Phone */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Phone
              </legend>

              <input
                type="tel"
                className="input"
                placeholder="Enter phone number"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
              />
            </fieldset>

            
            {/* Gender */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Gender
              </legend>

              <select
                className="select"
                value={gender}
                onChange={(event) =>
                  setGender(event.target.value)
                }
              >
                <option value="">Select gender</option>
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="Others">Others</option>
              </select>
            </fieldset>

            {/* Address */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Address
              </legend>

              <input
                type="text"
                className="input"
                placeholder="Enter address"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
              />
            </fieldset>

            {/* Skills */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Skills
              </legend>

              <input
                type="text"
                className="input"
                placeholder="React, Node.js, MongoDB"
                value={skills}
                onChange={(event) =>
                  setSkills(event.target.value)
                }
              />

              <p className="label">
                Separate skills with commas
              </p>
            </fieldset>

            {/* Photo URL */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Photo URL
              </legend>

              <input
                type="url"
                className="input"
                placeholder="https://example.com/photo.jpg"
                value={photoUrl}
                onChange={(event) =>
                  setPhotoUrl(event.target.value)
                }
              />
            </fieldset>

            {/* Bio */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Bio
              </legend>

              <textarea
                className="textarea"
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(event) =>
                  setBio(event.target.value)
                }
              />
            </fieldset>

            {/* Age */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Age
              </legend>

              <input
                type="number"
                className="input"
                placeholder="Enter age"
                value={age}
                onChange={(event) =>
                  setAge(event.target.value)
                }
              />
            </fieldset>

            {/* Submit */}
            <div className="card-actions justify-center mt-4">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Profile
              </button>
            </div>

          </form>
        </div>
        {showToast && (
          <div className="toast toast-top toast-center">
            <div className="alert alert-info">
              <span>Profile Updated Successfully</span>
            </div>
          </div>
        )}
        {error && (
          <div className="toast toast-top toast-center">
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Live Preview */}
      <UserCard
        user={{
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about: bio,
          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== ""),
        }}
      />

    </div>
  );
}

export default ProfileForm;
