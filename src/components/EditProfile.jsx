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
  const [photoSource, setPhotoSource] = useState(
    user?.photoUrl?.startsWith("data:image/") ? "local" : "url"
  );
  const [bio, setBio] = useState(user?.Bio || "");
  const [age, setAge] = useState(user?.age || "");
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      setError("Please choose an image smaller than 1.5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result;
      if (typeof result === "string") {
        setPhotoUrl(result);
        setError("");
      } else {
        setError("Could not read that image.");
      }
    };
    reader.onerror = () => setError("Could not read that image.");
    reader.readAsDataURL(file);
  };

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
    <div className="profile-editor-layout">

      {/* Edit Profile Form */}
      <div className="card profile-form-card card-border bg-base-100">
        <div className="card-body">

          <div className="profile-form-heading">
            <div>
              <p className="profile-panel-label">PROFILE DETAILS</p>
              <h2 className="card-title">Edit profile</h2>
            </div>
            <span className="profile-form-marker" aria-hidden="true">*</span>
          </div>

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

            {/* Profile photo */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Profile photo
              </legend>

              <div className="profile-photo-switch" role="group" aria-label="Choose photo source">
                <button
                  type="button"
                  className={`profile-photo-option ${photoSource === "url" ? "is-active" : ""}`}
                  onClick={() => setPhotoSource("url")}
                >
                  Photo URL
                </button>
                <button
                  type="button"
                  className={`profile-photo-option ${photoSource === "local" ? "is-active" : ""}`}
                  onClick={() => setPhotoSource("local")}
                >
                  Upload from device
                </button>
              </div>

              {photoSource === "url" ? (
                <input
                  key="photo-url"
                  type="url"
                  className="input"
                  placeholder="https://example.com/photo.jpg"
                  value={photoUrl.startsWith("data:image/") ? "" : photoUrl}
                  onChange={(event) => setPhotoUrl(event.target.value)}
                />
              ) : (
                <input
                  key="photo-file"
                  type="file"
                  className="file-input w-full"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handlePhotoUpload}
                />
              )}
              <p className="profile-photo-help">
                {photoSource === "local" ? "PNG, JPG, WEBP or GIF up to 1.5 MB." : "Paste a public image URL."}
              </p>
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
      <div className="profile-preview-panel">
        <div className="profile-preview-heading">
          <div>
            <p className="profile-panel-label">LIVE PREVIEW</p>
            <h2>How you appear</h2>
          </div>
          <span>Public</span>
        </div>
        <UserCard
        showActions={false}
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
    </div>
  );
}

export default ProfileForm;
