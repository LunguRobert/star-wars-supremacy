# Star Wars Supremacy - Online Multiplayer Card Game

This is an online multiplayer card game, named "Star Wars Supremacy", built with React, WebSockets, and SCSS. The game features complex mechanics and rules, providing a challenging and engaging experience for players. The game includes an active game mode in which players are dealt 50 random cards, and must strategically use them to defeat their opponents.

The game is designed to provide a seamless and immersive experience for players, with a visually appealing user interface and smooth animations. The use of web sockets allows for real-time communication between players, making the game experience more engaging and dynamic.

Please note that the game is currently not mobile compatible and can only be played on desktop devices.

## Live Demo
You can see a live demo of the game at https://star-wars-supremacy.onrender.com

## Features
- Complex mechanics and rules
- Active game mode with 50 random cards
- Multiplayer support using WebSockets
- Visually appealing user interface
- Smooth animations
- Built with React, WebSockets, and SCSS

## Technologies used
- React.js
- WebSockets
- SCSS

## Usage
- Clone or download the repository.
- Run `npm install` to install all the required dependencies.
- Run `npm start` to start the development server.
- The game can be accessed on `http://localhost:3000/`

## Customization
The game can be easily customized to suit the needs of your project. You can add more features, change the design or add more cards.

***

# Rules

Welcome to the exciting world of Star Wars Supremacy, the card game that pits players against each other in epic battles of strategy and skill. This guide will walk you through the basics of the game, including the rules, gameplay, and strategies for success.

## Game Setup

- Each player starts with 5 cards in their hand and automatically draws 1 card each new round.
- Each player starts with 20000 health points and a maximum of 9 mana, which increases each round by the game mode rule.
- The player who starts the round is chosen randomly and cannot attack in the first round.
- The game has 2 game modes: Duel of Fates and Clone Wars.
- Cards can be in attack position and defense position.

### Duel of Fates

- In this game mode, players have 50 cards.
- The cards are randomized by the rules: 1 epic card from each epic card, 2 neutral cards from each neutral card, and 1 special card from each special card.
- Players start with 5 mana and increase mana with previous max mana + 1 each round.

### Clone Wars

- In this game mode, players have 28 cards, all of which are epic cards.
- Players have 9 mana each round.

## Determining Damage

Calculate damage using attack v. attack (if you attack a card in attack position) or attack v. defense (if you attack a card in a defense position).

### attack v. attack

- Win: If your attack is greater than your opponent’s card, that card is destroyed and put in the Graveyard. The difference between the card’s attacks are subtracted from your opponent’s health points.
- Tie: If attacks are equal it is a tie. Both cards get destroyed and there is no sustained damage.
- Lose: If your attack if less than your opponent’s card, your card is destroyed and put in the Graveyard. The difference between the card’s attacks are subtracted from your health points.

### attack v. defense

- Win: If your attack exceeds your opponent’s defense, that card is destroyed and put in the Graveyard. Neither player sustains damage.
- Tie: If the attack and defense are equal, neither card is destroyed and neither player sustains damage.
- Lose: If your attack is less than the defense, neither are destroyed. The difference between your opponent’s defense and your attack is subtracted from your health points.
- You may attack your opponent directly if they have no cards. The full attack of your card is subtracted from their health points.

## Strategies for Success

- Plan your attacks carefully and consider the position of your opponent's cards.
- Keep an eye on your opponent's health points and try to take them down as quickly as possible.
- Use your special cards wisely and at the right time to gain an advantage.
- Keep track of your own health points and make sure to defend yourself when necessary.

With these tips and strategies in mind, you'll be well on your way to becoming a Star Wars Supremacy champion. May the force be with you!


Happy gaming!
