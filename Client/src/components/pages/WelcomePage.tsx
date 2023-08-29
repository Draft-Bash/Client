import '../../css/welcomePage.css'
import { Link } from 'react-router-dom';

const WelcomePage = () => {

  return (
        <div className="welcome-page">
            <nav>
                <Link className="login-btn" to="/login">LOGIN</Link>
                <Link className="sign-up-btn" to="/signup">SIGNUP</Link>
            </nav>
            <main>
                <h1>DraftMaster</h1>
                <p className="mock-draft-offer">Need Practice? Try a mock draft</p>
            </main>
        </div>
  );
};

export default WelcomePage;