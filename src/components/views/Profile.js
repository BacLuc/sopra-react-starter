import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/FormField";
import React, {useEffect, useState} from "react";
import User from "models/User";
import {Button} from "components/ui/Button";
import {Spinner} from "components/ui/Spinner";
import {api, handleError} from "helpers/api";
import {useHistory, useParams} from "react-router-dom";



const Profile = () => {
    const history = useHistory();
    const { profileId } = useParams();

    const [ user, setUser ] = useState(null);
    const [ error, setError ] = useState(null);

    let content = <Spinner/>

    const fetchProfile = async (userId) =>  {
        try {
            const response = await api.get(`/users/${userId}`);
            setUser(new User(response.data));
        } catch (e) {
            setError(handleError(e));
        }
    }

    useEffect(() => { fetchProfile(profileId) });

    if (error) {
        content = <div>Error fetching user, reason: {error}</div>
    } else if (user) {
        content = <div>
            <h1>Profile of user {user.name}, status: {user.status}</h1>
            <FormField
                label="Username"
                value={user.username}
                disabled={true}
            />
            <FormField
                label={"birthday"}
                value={"2022-02-03"}
                type={"date"}
                disabled={true}
            />
        </div>
    }

    return <BaseContainer>
        { content }

        <Button
            width="100%"
            onClick={() => history.push('/game')}
        >
            Back to dashboard
        </Button>
    </BaseContainer>
}

export default Profile;
