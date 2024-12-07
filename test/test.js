import {addBalls, EvilCircle, Ball, randomRGB, balls} from '../js/game.js';

QUnit.module("Game Logic Tests", function() {
    QUnit.test("addBalls correctly populates the balls array", function(assert) {
      const initialCount = balls.length;
      const numBallsToAdd = 5;
      addBalls(numBallsToAdd);
  
      assert.strictEqual(balls.length, initialCount + numBallsToAdd, 
        "The balls array should increase by the number of added balls.");
      assert.ok(balls.every(ball => ball instanceof Ball), 
        "All new elements in the balls array should be instances of the Ball class.");
    });
  
});