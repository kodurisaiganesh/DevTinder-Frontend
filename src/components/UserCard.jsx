import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const UserCard = ({ user, showActions = true }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActioned, setIsActioned] = useState(false);
  const navigate = useNavigate();
  const { _id,firstName, lastName, skills, photoUrl, about, age, gender, Skills, Bio } = user;
  const userSkills = skills || Skills;
  const userAbout = about || Bio;
  const fallbackImage = gender?.toLowerCase() === "female"
    ? "/female-avatar.svg"
    : "/male-avatar.svg";

  const handleRequest = async (status,_id) => {
    try {
      setIsSubmitting(true);
      await axios.post(
        `${BASE_URL}sent/request/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      setIsActioned(true);
    } catch (error) {
      console.error("Request failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isActioned) return null;

  return (
    <div className="card home-user-card bg-base-100">
      <figure className="home-user-card-figure">
        <img
          className="aspect-square w-full object-cover"
          src={photoUrl || fallbackImage}
          alt={`${firstName}'s profile`}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
          }}
        />
      </figure>

      <div className="card-body home-user-card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>

        {(age || gender) && (
          <p className="text-sm text-gray-500">
            {age && `${age} yrs`}
            {age && gender && " • "}
            {gender}
          </p>
        )}

        {userAbout && <p className="home-user-card-about">{userAbout}</p>}

        {/* Skills */}
        <div className="card-actions home-user-card-skills justify-end">
          {userSkills?.map((skill) => (
            <div key={skill} className="badge badge-outline">
              {skill}
            </div>
          ))}
        </div>

        {showActions && (
          <div className="home-user-card-actions flex justify-center gap-4 mt-4">
            <button
              className="btn btn-error"
              disabled={isSubmitting}
              onClick={() => handleRequest("ignored",_id)}
            >
              Ignore
            </button>

            <button
              className="btn btn-primary"
              disabled={isSubmitting}
              onClick={() => handleRequest("interested",_id)}
            >
              Interested
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => navigate(`/connection/${_id}`)}
            >
              View profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;