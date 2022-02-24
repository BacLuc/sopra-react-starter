import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Register.scss';
import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/FormField";


const Register = props => {
  const history = useHistory();
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const register = async () => {
    try {
      const requestBody = JSON.stringify({username, name, password});
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);

      // Register successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={un => setUsername(un)}
          />
          <FormField
            label="Name"
            value={name}
            onChange={n => setName(n)}
          />
          <FormField
              label={"Password"}
              value={password}
              onChange={p => setPassword(p)}
              type={"password"}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !name}
              width="100%"
              onClick={() => register()}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Register;
