import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/FormField";
import React, {useEffect, useState} from "react";
import User from "models/User";
import {Button} from "components/ui/Button";
import {Spinner} from "components/ui/Spinner";
import {api, handleError} from "helpers/api";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";



const Profile = () => {
    const history = useHistory();
    const { profileId } = useParams();

    const [ user, setUser ] = useState(null);
    const [ error, setError ] = useState(null);

    let content = <Spinner/>

    const fetchProfile = async (userId, cancelTokenSource) =>  {
        try {
            const response = await api.get(
                `/users/${userId}`,
                {
                    cancelToken: cancelTokenSource.token
                });
            setUser(new User(response.data));
        } catch (e) {
            if (axios.isCancel(e)) {
                return;
            }
            setError(handleError(e));
        }
    }

    useEffect(() => {
        const cancelToken = axios.CancelToken;
        const cancelTokenSource = cancelToken.source();
        fetchProfile(profileId, cancelTokenSource);
        return () => cancelTokenSource.cancel()
    }, []);

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
