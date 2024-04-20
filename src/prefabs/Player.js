// Player prefab
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this).setOrigin(0.5).setScale(2).setDepth(6)
        scene.physics.add.existing(this).setOrigin(0.5).setScale(2).setDepth(6)

        this.body.setSize(15, 15).setOffset(5, 15)
        this.body.setCollideWorldBounds(true)

        // set custom Player properties
        this.direction = direction 
        this.playerVelocity = 150 

        // initialize state machine managing Player (initial state, possible states, state args[])
        scene.playerFSM = new StateMachine('idle', {
            idle: new IdleState(),
            walk: new WalkState(),
        }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
    }
}

// Player-specific state classes
class IdleState extends State {
    enter(scene, player) {
        player.setVelocity(0)
        player.anims.play(`idle-${player.direction}`)
        player.anims.stop()
    }

    execute(scene, player) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down} = scene.keys

        // transition to move if pressing a movement key
        if(left.isDown || right.isDown || up.isDown || down.isDown ) {
            this.stateMachine.transition('walk')
            return
        }
    }
}

class WalkState extends State {
    execute(scene, player) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down } = scene.keys

        // transition to idle if not pressing movement keys
        if(!(left.isDown || right.isDown || up.isDown || down.isDown)) {
            this.stateMachine.transition('idle')
            return
        }

        // handle movement
        let moveDirection = new Phaser.Math.Vector2(0, 0)
        if(up.isDown) {
            moveDirection.y = -1
            player.direction = 'up'
        } else if(down.isDown) {
            moveDirection.y = 1
            player.direction = 'down'
        }
        if(left.isDown) {
            moveDirection.x = -1
            player.direction = 'left'
        } else if(right.isDown) {
            moveDirection.x = 1
            player.direction = 'right'
        }
        // normalize movement vector, update Player position, and play proper animation
        moveDirection.normalize()
        player.setVelocity(player.playerVelocity * moveDirection.x, player.playerVelocity * moveDirection.y)
        player.anims.play(`walk-${player.direction}`, true)
    }
}