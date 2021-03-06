import React, { Component } from "react";
import "./App.css"
import chesschain from "./chesschain";
import firebase from './fire';
import NewGame from './NewGame'

export default class Welcome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rank: "",
      gamesPlayed: "",
      gaming: false,
      wager: false
    };

    this.handleClick = this.handleClick.bind(this)
  }

  async componentDidMount() {

    let rank = await firebase.database().ref(`users/${this.props.id}`).child('rank').once('value')

    rank = Object.values(rank)[0].value_
    const wins = await chesschain.methods
      .getPlayerInfo(this.props.address, 2)
      .call();

    const losses = await chesschain.methods
      .getPlayerInfo(this.props.address, 3)
      .call();

    this.setState({ rank, wins, losses, gamesPlayed: +wins + +losses });
  }


  handleClick = async event => {
    event.preventDefault();
    this.setState({ gaming: true })
    const game = await firebase
      .database()
      .ref('/gamesPending')
    console.log(game)
    // let newGame;
    //   if (!game.path.pieceNum_){
    //     newGame = await firebase
    //       .database()
    //       .ref('/gamesPending')
    //       .set({
    //         player: this.props.id,
    //         startingRank: this.state.rank,
    //         wager: this.state.wager
    //       })
    //   } else {
    //     await firebase
    //       .database()
    //       .ref('/gamesPending')
    //       .remove()
    //     await firebase
    //       .database()
    //       .ref('/games')
    //       .set({
    //         player1: game.player,
    //         player2: this.props.id,
    //         wager: this.state.wager
    //       })
    //   }

  }

  render() {
    console.log(this.props)
    return (
      <div>
      { !this.state.gaming ?
        <div>
          <h2> Welcome {this.props.username}! </h2>
          <hr />
          <h2> Dashboard </h2>
          <div>
            <h3> Rank: {this.state.rank} </h3>
            <h3> Games Played: {this.state.gamesPlayed} </h3>
            <h3> Wins: {this.state.wins} </h3>
            <h3> Losses: {this.state.losses} </h3>
          </div>
          <div>
            <button onClick={this.handleClick}>
              Start A Game
            </button>
          </div>
        </div> : <div />
      }
      {
        this.state.gaming ?
          <div>
            <NewGame
              username={this.props.username}
              rank={this.state.rank}
            />
            <div>
            <button
              onClick={() => {
                alert("Are you sure you want to end the game? Ending the game will count as a forfeit and  will affect your rank!")
                this.setState({ gaming: false })}
              }
            >
              End Game
            </button>
            </div>
          </div>
          : <div />
      }
      </div>
    );
  }
}
