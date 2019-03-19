import React, { Component } from "react";
import firebase from "../firebase/index";
import {
  CardDeck,
  Col,
  Card,
  CardHeader,
  Button,
  CardBody,
  CardText,
  CardFooter,
  Modal,
  ModalBody,
  ModalFooter
} from "reactstrap";

class Data extends Component {
  constructor() {
    super();
    this.state = {
      listName: "",
      cardName: "",
      editCardName: "",
      keyCard: "",
      keyList: "",
      inputKey: "",
      dataLists: [],
      dataCards: [],
      editing: false
    };
  }

  componentDidMount() {
    // console.log(firebase)
    const myList = firebase.database().ref("lists/");
    // console.log(myList)
    myList.on("value", snapshot => {
      const myListFromDatabase = snapshot.val();
      if (myListFromDatabase === null) {
        console.log("List at our firebase is null");
      } else {
        const lists = Object.keys(snapshot.val()).map(key => {
          return {
            key: key,
            listName: myListFromDatabase[key].listName
          };
        });
        this.setState({
          dataLists: lists
        });
      }
    });

    const myCard = firebase.database().ref("cards/");
    // console.log(myCard)
    myCard.on("value", snapshot => {
      const myCardFromDatabase = snapshot.val();
      // console.log(myCardFromDatabase)
      if (myCardFromDatabase === null) {
        console.log("Card at our firebase is null");
      } else {
        const cards = Object.keys(snapshot.val()).map(key => {
          return {
            key: key,
            cardName: myCardFromDatabase[key].cardName,
            listKey: myCardFromDatabase[key].listKey
          };
        });
        this.setState({
          dataCards: cards
        });
      }
    });
  }

  _handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  _saveList = e => {
    if (this.state.listName === "") {
      alert("List cannot be empty");
    } else {
      const newListKey = firebase
        .database()
        .ref("lists/")
        .push().key;

      firebase
        .database()
        .ref("lists/")
        .update({
          [newListKey]: {
            listName: this.state.listName
          }
        });
      this.setState({
        listName: ""
      });
    }
  };

  _saveCard = (key, title, index, e) => {
    // console.log("key from card");
    // console.log(key.key);
    // console.log("title from card:");
    // console.log(title.title);
    if (this.state.cardName === "") {
      alert("Card cannot be empty");
    } else {
      const newCardKey = firebase
        .database()
        .ref("cards/")
        .push().key;

      firebase
        .database()
        .ref("cards/")
        .update({
          [newCardKey]: {
            listKey: key.key,
            cardName: title.title
          }
        });

      this.setState({
        cardName: ""
      });
    }
  };

  _handleDeleteList = key => {
    const { dataCards } = this.state;
    console.log(dataCards);
    let countCardOnList = 0;

    for (let i = 0; i < dataCards.length; i++) {
      if (key === dataCards[i].listKey) {
        countCardOnList++;
      }
    }
    console.log("countCardOnList: " + countCardOnList);
    if (countCardOnList > 0) {
      for (let i = 0; i < dataCards.length; i++) {
        if (key === dataCards[i].listKey) {
          this._handleDeleteCard(dataCards[i].key);
        }
      }
    }

    firebase
      .database()
      .ref(`lists/${key}`)
      .remove();

    console.log("Success delete List");
    const myListLength = this.state.dataLists.length;
    if (myListLength === 1) {
      this.setState({
        dataLists: []
      });
    }
  };

  _handleDeleteCard = key => {
    firebase
      .database()
      .ref(`cards/${key}`)
      .remove();

    console.log("Success delete Card");
    const myCardLength = this.state.dataCards.length;
    // console.log(myCardLength)
    if (myCardLength === 1) {
      this.setState({
        dataCards: []
      });
    }
  };

  _handleMoveCard = (keyOfCard, moveByIndex) => {
    const { dataCards, dataLists } = this.state;
    // Get key from List destination movement
    // console.log(keyOfCard);
    const moveToAnotherList = dataLists[moveByIndex].key;
    // console.log(moveToAnotherList);
    let newKeyOfCard;
    for (let i = 0; i < dataCards.length; i++) {
      if (keyOfCard === dataCards[i].key) {
        newKeyOfCard = i;
      }
    }

    // console.log(newKeyOfCard);
    const newCard = dataCards[newKeyOfCard];
    // console.log(newCard);

    firebase
      .database()
      .ref("cards/")
      .update({
        [newCard.key]: {
          listKey: moveToAnotherList,
          cardName: newCard.cardName
        }
      });
  };

  _handleChooseCard = key => {
    // console.log(key);
    const { dataCards } = this.state;
    // console.log(dataCards);
    let indexOfCard;
    for (let i = 0; i < dataCards.length; i++) {
      if (key === dataCards[i].key) {
        // console.log(dataCards[i].cardName);
        indexOfCard = i;
      }
    }

    const editCard = dataCards[indexOfCard];
    // console.log(editCard.cardName);

    this.setState({
      editCardName: editCard.cardName,
      keyCard: key,
      keyList: editCard.listKey
    });
  };

  _handleEdit = () => {
    const { editCardName, keyCard, keyList } = this.state;
    // console.log(editCardName);
    // console.log(keyCard);

    if (editCardName !== "") {
      // console.log("You can edit");

      firebase
        .database()
        .ref("cards/")
        .update({
          [keyCard]: {
            cardName: editCardName,
            listKey: keyList
          }
        });
    } else {
      // console.log("You can't edit");
      alert("Card cannot be empty");
    }
  };

  toggle = e => {
    this.setState(prevState => ({
      editing: !prevState.editing
    }));
  };

  render() {
    return (
      <div>
        <CardDeck>
          {this.state.dataLists.map((list, index) => {
            const cards = this.state.dataCards.filter(
              card => card.listKey === list.key
            );
            return (
              <div key={index}>
                <Col sm="2.5">
                  <Card>
                    <CardHeader>
                      {list.listName}
                      <Button
                        onClick={() => {
                          this._handleDeleteList(list.key);
                        }}
                        close
                      />
                    </CardHeader>
                    {cards.map((card, indexTask) => {
                      return (
                        <CardBody key={indexTask}>
                          <div>
                            <CardText>
                              {card.cardName}
                              <Button
                                onClick={() => {
                                  this._handleDeleteCard(card.key);
                                }}
                                close
                              />
                            </CardText>
                            {index >= 1 ? (
                              <Button
                                onClick={() => {
                                  this._handleMoveCard(card.key, index - 1);
                                }}
                              >
                                Left
                              </Button>
                            ) : (
                              <Button disabled>Left</Button>
                            )}
                            <Button
                              onClick={() => {
                                this._handleChooseCard(card.key);
                                this.toggle();
                              }}
                            >
                              Edit
                            </Button>
                            <Modal
                              isOpen={this.state.editing}
                              toggle={this.toggle}
                              className={this.props.className}
                            >
                              <ModalBody>
                                <input
                                  type="text"
                                  name="editCardName"
                                  value={this.state.editCardName}
                                  onChange={this._handleChange}
                                />
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  onClick={() => {
                                    this._handleEdit();
                                    this.toggle();
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button color="secondary" onClick={this.toggle}>
                                  Cancel
                                </Button>
                              </ModalFooter>
                            </Modal>
                            {index < this.state.dataLists.length - 1 ? (
                              <Button
                                onClick={() => {
                                  this._handleMoveCard(card.key, index + 1);
                                }}
                              >
                                Right
                              </Button>
                            ) : (
                              <Button disabled>Right</Button>
                            )}
                          </div>
                        </CardBody>
                      );
                    })}
                    <CardFooter>
                      <div className="row">
                        <input
                          type="text"
                          name="cardName"
                          placeholder="Add a task"
                          value={this.state.cardName}
                          onChange={this._handleChange}
                        />
                        <Button
                          onClick={(key, title, index, e) =>
                            this._saveCard(
                              { key: list.key },
                              { title: this.state.cardName },
                              { index: list.index },
                              { e }
                            )
                          }
                        >
                          Save
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </Col>
              </div>
            );
          })}
          <Col sm="2.5">
            <Card>
              <CardHeader>
                <div className="row">
                  <input
                    type="text"
                    name="listName"
                    placeholder="Add a list"
                    value={this.state.listName}
                    onChange={this._handleChange}
                  />
                  <Button onClick={() => this._saveList()}>Save</Button>
                </div>
              </CardHeader>
            </Card>
          </Col>
        </CardDeck>
      </div>
    );
  }
}

export default Data;
