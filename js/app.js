document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('div.grid > div'))
  const width = 10
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  let nextRandom = 0
  let timerId

  // mobile-buttons
  const leftBtnMobile = document.querySelector('#button_left')
  const downBtnMobile = document.querySelector('#button_down')
  const rotateBtnMobile = document.querySelector('#button_rotate')
  const rightBtnMobile = document.querySelector('#button_right')



  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2, width * 2 + 1],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]


  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  //move the Tetromino moveDown
  let currentPosition = 4
  let currentRotation = 0


  function randomTetrominoFunction() {
    return Math.floor(Math.random() * theTetrominoes.length)
  }

  function randomRotationFunction() {
    return Math.floor(Math.random() * lTetromino.length)
  }

  // randomly select a Tetromino and its first rotation
  let randomTetromino = randomTetrominoFunction()
  let randomRotation = randomRotationFunction()
  currentRotation = randomRotation
  let currentTetromino = theTetrominoes[randomTetromino][randomRotation]

  // draw the Tetromino

  function draw() {
    currentTetromino.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    })
  }

  //undraw the Tetromino
  function undraw() {
    currentTetromino.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
    })
  }

  //make the tetromino move down every second
  // timerId = setInterval(moveDown, 1000)

  //assign functions to keyCodes
  function contol(e) {
    switch (e.keyCode) {
      case 37: moveLeft(); break
      case 38: rotate(); break
      case 39: moveRight(); break
      case 40: moveDown(); break
      default: break;
    }
  }

  document.addEventListener('keyup', contol)


  leftBtnMobile.addEventListener('click', () => {moveLeft();})
  downBtnMobile.addEventListener('click', () => {moveDown();})
  rotateBtnMobile.addEventListener('click', () => {rotate();})
  rightBtnMobile.addEventListener('click', () => {moveRight();})

  //move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  //freeze function
  function freeze() {
    if (currentTetromino.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      currentTetromino.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      randomTetromino = nextRandom
      nextRandom = randomTetrominoFunction()
      randomRotation = randomRotationFunction()
      currentTetromino = theTetrominoes[randomTetromino][randomRotation]
      currentPosition = 4
      currentRotation = randomRotation
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }


  //move the tetromino left, unless is at the edge or there is a blockage

  function moveLeft() {
    undraw()
    const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) currentPosition -= 1

    /*If on the left space, when we would like to move tetromino already stands a tetromino,
    so we want to push it back 1 space. So tetromino like not to be moved left.*/
    if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }

    draw()
  }


  function moveRight() {
    undraw()
    const ifAtRightEdge = currentTetromino.some(index => (currentPosition + index + 1) % width === 0)

    if (!ifAtRightEdge) currentPosition += 1

    if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  function rotate() {
    undraw()
    let previousRotation = currentRotation // save current value for if statement
    let tetrominoBeforeRotate = theTetrominoes[randomTetromino][previousRotation]
    const ifAtRightEdgeBeforeRotation = tetrominoBeforeRotate.some(index => ((currentPosition + index + 1) % width === 0))
    const ifAtLeftEdgeBeforeRotation = tetrominoBeforeRotate.some(index => ((currentPosition + index) % width === 0))
    const ifLongTetrominoNearEdge = tetrominoBeforeRotate.some(index => ((currentPosition + index + 2) % width === 0))

    // console.log("ifAtRightEdgeBeforeRotation = " + ifAtRightEdgeBeforeRotation);
    // console.log("ifAtLeftEdgeBeforeRotation = " + ifAtLeftEdgeBeforeRotation);
    currentRotation++ // increment for check
    if (currentRotation === currentTetromino.length) currentRotation = 0 // cycle our rotation
    currentTetromino = theTetrominoes[randomTetromino][currentRotation]

    const ifAtBottomAfterRotation = currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))

    const fromLeftToRight = currentTetromino.some(index => ((currentPosition + index + 1) % width === 0))
    const fromRightToLeft = currentTetromino.some(index => ((currentPosition + index) % width === 0))

    // console.log("fromLeftToRight = " + fromLeftToRight);
    // console.log("fromRightToLeft = " + fromRightToLeft);


    if ((fromRightToLeft && ifAtRightEdgeBeforeRotation) ||
      (fromLeftToRight && ifAtLeftEdgeBeforeRotation) ||
      (randomTetromino == 4 && ifLongTetrominoNearEdge && fromRightToLeft) ||
      (ifAtBottomAfterRotation)
    ) {
      // console.log("%cNO SPACE FOR ROTATION", "color:red;");
      currentRotation = previousRotation
      currentTetromino = theTetrominoes[randomTetromino][previousRotation]
    }
    // console.log("------------------------");
    draw()
  }

  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4
  let displayIndex = 0

  //the Tetrominoes without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [displayWidth + 1, displayWidth + 2, displayWidth * 2, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
  ]

  //display the shape in the mini-grid display
  function displayShape() {
    // remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    })

    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    })
  }

  //add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = randomTetrominoFunction()
      displayShape()
    }
  })

  var score = 0

  //adding score
  function addScore() {
    for (let i = 0; i < 200; i += width) {
      const rowForDelete = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

      if (rowForDelete.every(index => squares[index].classList.contains('taken'))) {

        score += 10
        scoreDisplay.innerHTML = score

        rowForDelete.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }


  function gameOver() {
    if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))){
      alert("Game over. Your score is: " + scoreDisplay.innerHTML)
      clearInterval(timerId)
    }
  }


})
