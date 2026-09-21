import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const ConnectionProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}user/profile/${userId}`, {
          withCredentials: true
        });
        setProfile(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load this profile.");
      }
    };
    fetchProfile();
  }, [userId]);

  if (error) {
    return (
      <div className="profile-page-state">
        <p>{error}</p>
        <Link className="btn btn-primary mt-4" to="/connections">Back to connections</Link>
      </div>
    );
  }

  if (!profile) return <div className="profile-page-state">Loading profile...</div>;

  const fallbackImage = profile.gender?.toLowerCase() === "female"
    ? "/female-avatar.svg"
    : "/male-avatar.svg";

  const handleRequest = async (status) => {
    try {
      setIsSubmitting(true);
      await axios.post(
        `${BASE_URL}sent/request/${status}/${profile._id}`,
        {},
        { withCredentials: true }
      );
      setActionMessage(status === "interested" ? "Connection request sent." : "Profile ignored.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Request could not be sent.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="connection-profile-page">
      <Link className="profile-back-link" to="/connections">Back to connections</Link>
      <article className="connection-profile-card">
        <div className="connection-profile-hero">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={`${profile.firstName}'s profile`}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackImage;
              }}
            />
          ) : (
            <img src={fallbackImage} alt={`${profile.firstName}'s default profile`} />
          )}
          <div>
            <p className="connections-eyebrow">CONNECTION PROFILE</p>
            <h1>{profile.firstName} {profile.lastName}</h1>
            {(profile.age || profile.gender) && (
              <p className="profile-meta">
                {profile.age && `${profile.age} years`}
                {profile.age && profile.gender && " · "}
                {profile.gender}
              </p>
            )}
          </div>
        </div>

        {!profile.isConnection && !actionMessage && (
          <div className="connection-profile-actions">
            <button
              className="btn btn-primary"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleRequest("interested")}
            >
              Interested
            </button>
            <button
              className="btn btn-outline"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleRequest("ignored")}
            >
              Ignore
            </button>
          </div>
        )}
        {actionMessage && <p className="connection-profile-success">{actionMessage}</p>}

        <div className="connection-profile-content">
          <div>
            <h2>About</h2>
            <p>{profile.Bio || "No bio added yet."}</p>
          </div>
          {profile.Skills?.length > 0 && (
            <div>
              <h2>Skills</h2>
              <div className="profile-skills">
                {profile.Skills.map((skill) => <span className="badge badge-outline" key={skill}>{skill}</span>)}
              </div>
            </div>
          )}
          {profile.address && (
            <div>
              <h2>Location</h2>
              <p>{profile.address}</p>
            </div>
          )}
        </div>
      </article>
    </section>
  );
};

export default ConnectionProfile;
