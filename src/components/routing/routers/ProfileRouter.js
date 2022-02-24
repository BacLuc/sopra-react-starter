import PropTypes from "prop-types";
import {Redirect, Route} from "react-router-dom";
import Profile from "components/views/Profile";

const ProfileRouter = (props) => {
    return <div>
        <Route exact path={'/profile/:profileId'}>
            <Profile/>
        </Route>
        <Route exact path={'/profile'}>
            <Redirect to={props.redirectTo}/>
        </Route>
    </div>
}

ProfileRouter.propTypes = {
    redirectTo: PropTypes.string
}

export default ProfileRouter;
