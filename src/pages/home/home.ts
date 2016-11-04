import { Component, ViewChild } from '@angular/core';

import { NavController, Content } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;

  public messages: Array<Object> = [];
  public choices: Array<Object> = [];
  public loadingMessages: Boolean = true;

  private _messages: Array<Object> = [{
    text: 'Hi there! Hope you are having a good day'
  }, {
    text: 'Analysing your data...'
  }, {
    text: 'You are at 55 mins of activity so far!'
  }, {
    choices: [{
      text: 'Got it!',
      type: 'secondary',
      messages: [{
        text: 'Sometimes getting active is harder for our minds than our bodies'
      }, {
        text: 'The hardest part is the first few steps'
      }, {
        choices: [{
          text: 'Uh, ok',
          type: 'secondary',
          messages: [{
            text: 'That motiviation to get started is in you'
          }, {
            text: 'Otherwise you wouldn\'t have signed up for this challenge.'
          }, {
            text: 'So keep up the good work and get your steps up!'
          }, {
            choices: [{
              text: 'Ok',
              type: 'secondary'
            }, {
              text: 'Finish',
              type: 'danger',
              action: () => {
                this._stop();
              }
            }]
          }]
        }]
      }]
    }]
  }];

  constructor(public navCtrl: NavController) {
    // TODO: load the messages on the server
    setTimeout(() => {
      this._start();
    }, 1000);
  }

  public selectChoice(choice) {
    // clear choices
    this.choices = null;

    if ('action' in choice) {
      choice.action();
    }
    else {
      // add choice to list of messages
      choice.selected = true;
      this._addMessages([choice]);

      this.loadingMessages = true;
      // TODO: send choice to server and retrieve list of messages to display
      // here we saved the message with the choice
      setTimeout(() => {
        this._addMessages(choice.messages);
      }, 500);
    }
  }

  private _start() {
    this._addMessages(this._messages);
  }

  private _stop() {
    this.messages = [];
  }

  private _addMessages(messages) {
    this.loadingMessages = false;
    this._handleNextMessage(messages);
  }

  private _handleNextMessage(messages) {
    if (messages && messages.length > 0) {
      var message = messages.shift();

      // simple text message, display
      if (message.text) {
        this._addMessage(message, () => {
          this._handleNextMessage(messages);
        });
      }
      else if (message.choices) {
        this.choices = message.choices;
        setTimeout(() => {
          this.content.scrollToBottom();
        });
      }
    }
  }

  private _addMessage(message, callback) {
    this.messages.push(message);
    setTimeout(() => {
      this.content.scrollToBottom().then(callback);
    }, 500);
  }
}
