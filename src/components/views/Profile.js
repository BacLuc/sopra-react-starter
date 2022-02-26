import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/FormField";
import React, {useEffect, useState} from "react";
import User from "models/User";
import {Button} from "components/ui/Button";
import {Spinner} from "components/ui/Spinner";
import {api, handleError} from "helpers/api";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import useToken from "helpers/token";
import PropTypes from "prop-types";

import 'styles/views/Profile.scss'


const SaveOrEditButton = (props) => {
    if(!props.show) {
        return '';
    }
    const onClick = () => {
        if(props.inEditMode) {
            return props.onSave();
        }
        return props.onEdit();
    }
    const text = props.inEditMode ? "Save" : "Edit";
    return <Button
        width="100%"
        onClick={onClick}
    >
        {text}
    </Button>
}

SaveOrEditButton.propTypes = {
    show: PropTypes.bool,
    inEditMode: PropTypes.bool,
    onEdit: PropTypes.func,
    onSave: PropTypes.func
}

const Profile = () => {
    const history = useHistory();
    const { profileId } = useParams();
    const token = useToken();

    const [ user, setUser ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ editMode, setEditMode ] = useState(false);

    const editable = user && `${user?.id}` === token?.sub;

    const updateUsername = name => {
        setUser(new User({
            ...user,
            username: name
        }))
    }

    const updateBirthday = birthday => {
        setUser(new User({
            ...user,
            birthday: birthday
        }))
    }

    const saveUser = async () => {
      const {username, birthday} = user;
      try {
          await api.put(`/users/${profileId}`, {username, birthday});
          setEditMode(false);
      } catch (e) {
          setError(handleError(error));
      }
    }

    useEffect(() => {
        const fetchProfile = async (cancelTokenSource) =>  {
            try {
                const response = await api.get(
                    `/users/${profileId}`,
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
        const cancelToken = axios.CancelToken;
        const cancelTokenSource = cancelToken.source();
        fetchProfile(cancelTokenSource);
        return () => cancelTokenSource.cancel()
    }, [profileId]);

    const content = [];

    if (!user) {
        content.push(<Spinner key={'spinner'}/>);
    }

    if (error) {
        content.push(<div key={'error'}>Error, reason: {error}</div>);
    }
    if (user) {
        content.push(<div key={'form'}>
            <h1>Profile of user {user.name}, status: {user.status}</h1>
            <FormField
                label="Username"
                value={user.username}
                disabled={!editMode}
                onChange={updateUsername}
            />
            <FormField
                label={"birthday"}
                value={user.birthday ?? ''}
                type={"date"}
                disabled={!editMode}
                onChange={updateBirthday}
            />
            <SaveOrEditButton
                show={editable}
                inEditMode={editMode}
                onEdit={() => {setEditMode(true)}}
                onSave={saveUser}
            />
        </div>);
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
