import React from 'react';
import { fetchUserData, cancelFetch } from './dataFetcher';
import { Userlist } from './Userlist';

export class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state={userData: null} // used to represent a Profile without any data.
  }

  loadUserData(){
    // 1. sets userData state to null while (or is it before?)the data is loaded. 
    this.setState({ userData: null});
 
    // 2. once it is loaded. we update it. 
    this.fetchID = fetchUserData(this.props.username, (userData)=>{
     this.setState({ userData: userData});
     });
   }
  
  componentDidMount(){
    // calls data loading method after the component loads.
    this.loadUserData();
  }
  componentDidUpdate(prevProps){
    /* if props.username , passed down from App.js did change, then the link must have been clicked. 
    the App.js's state has changed. Props linked to App's state will change as well, the Profile component will then update
    what needs to happen is 1. cancel all current fetch requests adn 2. call loadUserData again. */
    if (this.props.username !== prevProps.username){
      cancelFetch(this.fetchID);
      this.loadUserData();
    }
  }
  componentWillUnumount(){
    // use cancel fetch on a fetchUserData instance when the component is about to unmount. 
    cancelFetch(this.fetchID);
  }

  render() {
    // isLoading should only be true when state UserData is null
    const isLoading = this.state.userData===null;

    let className = 'Profile';
    if (isLoading) {
      className += ' loading';
    }

    let name;
    if (isLoading){
      name = 'Loading...';
    }else{
      name = this.state.userData.name;
    }

    let bio;
    if (isLoading){
      bio = 'Loafing... '
    }else{
      bio=this.state.userData.bio
    }

    let friends;
    if (isLoading){
      friends=[];
    }else{
      friends=this.state.userData.friends;
    }

    return (
      <div className={className}>
        <div className="profile-picture">{ !isLoading && (
          <img src={this.state.userData.profilePictureUrl} alt='' />
          )}
        </div>
        <div className="profile-body">
          <h2>{name}</h2>
          <h3>@{this.props.username}</h3>
          <p>{bio}</p>
          <h3>My friends</h3>
          <Userlist usernames={friends} onChoose={this.props.onChoose} />
        </div>
      </div>
    );
  }
}