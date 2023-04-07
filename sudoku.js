"use strict";

var EASY_PUZZLE = "1-58-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--";
var MEDIUM_PUZZLE = "-3-5--8-45-42---1---8--9---79-8-61-3-----54---5------78-----7-2---7-46--61-3--5--";
var HARD_PUZZLE = "8----------36------7--9-2---5---7-------457-----1---3---1----68--85---1--9----4--";

// Set this variable to true to publicly expose otherwise private functions inside of SudokuSolver
var TESTABLE = true;

var SudokuSolver = function (testable) {
  var solver;

  // PUBLIC FUNCTIONS
  function solve(boardString) {
    var boardArray = boardString.split("");
    if (boardIsInvalid(boardArray)) {
      return false;//shows Invalid Board pop-up
    }
    return recursiveSolve(boardString);
  }

  function solveAndPrint(boardString) {
    var solvedBoard = solve(boardString);
    console.log(toString(solvedBoard.split("")));
    return solvedBoard;
  }

  // PRIVATE FUNCTIONS
  function recursiveSolve(boardString) {
    var boardArray = boardString.split("");//converted boardstring into board array
    if (boardIsSolved(boardArray)) {
      return boardArray.join("");
      //completed the sudoku and return by joining all the array elemnts in string form
    }

    //if box not filled then how to fill this


    var cellPossibilities = getNextCellAndPossibilities(boardArray);
    //will contain possibility of each cell ie for a particular index what are the possible choices
    var nextUnsolvedCellIndex = cellPossibilities.index;
    var possibilities = cellPossibilities.choices;
    for (var i = 0; i < possibilities.length; i++) {
      boardArray[nextUnsolvedCellIndex] = possibilities[i];
      var solvedBoard = recursiveSolve(boardArray.join(""));
      if (solvedBoard) {
        return solvedBoard;
      }
    }
    return false;
  }

  function boardIsInvalid(boardArray) {
    return !boardIsValid(boardArray);
    //negation of board is valid
  }

  function boardIsValid(boardArray) {
    return allRowsValid(boardArray) && allColumnsValid(boardArray) && allBoxesValid(boardArray);
    //combination of all rows valid, allcolumns valid, each box of sudoku is valid 
    //in all 3 check no. are in range 1-9 and there is no repetition
  }

  function boardIsSolved(boardArray) {
    for (var i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === "-") {
        return false;
      }
    }
    return true;
  }

  function getNextCellAndPossibilities(boardArray) {
    for (var i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === "-") {
        //when blankspace then enter numbers at that place
        var existingValues = getAllIntersections(boardArray, i);
        //find all no. in curr row,curr col and curr box --> Exclude them from possibility 
        var choices = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].filter(function (num) {
          return existingValues.indexOf(num) < 0;
        });
        return { index: i, choices: choices };
      }
    }
  }
  /*This code block is a part of a function named getPossibleChoices, which takes a boardArray and an index
   as input and returns an object containing the index and an array of possible choices that can be placed 
   at that index.
   The code block checks if the value at the given index in the boardArray is a blank space ("-"). 
   If it is, it calls another function named getAllIntersections to get all the values that are already present
   in the same row, column, and box as the given index.
   Next, the code filters out the numbers 1 to 9 that are not present in the existingValues array, which is 
   the union of values in the same row, column, and box. The remaining numbers are then stored in an array 
   called choices.
   Finally, the function returns an object containing the index of the given cell and the array of possible 
   choices for that cell.
   */


  function getAllIntersections(boardArray, i) {
    //combing the numbers in current row, current col and current box -> concatenated string
    return getRow(boardArray, i).concat(getColumn(boardArray, i)).concat(getBox(boardArray, i));
  }

  function allRowsValid(boardArray) {
    //start index of each row
    return [0, 9, 18, 27, 36, 45, 54, 63, 72].map(function (i) {
      return getRow(boardArray, i);
    }).reduce(function (validity, row) {
      return collectionIsValid(row) && validity;
    }, true);// here validity var is assigned true stating when overall(colllectionValid)condition is true 
    //we are checking collection is valid ;
    //overall both are true then return TRUE else if invalid collection then False && True give FALSE
    //ie no duplicate element is present in the string of length 9 (from 1-9)
  }
  /*The function first creates an array of start indices for each row in the board. 
  Then, using the map function, it applies the getRow function to each of these indices and gets an array of 
  all rows. The getRow function takes an index and the board array and returns the row array corresponding 
  to that index.Next, the reduce function is applied to the array of rows. It iterates through all the rows 
  and checks if each row is valid by calling the collectionIsValid function. 
  The collectionIsValid function checks if a given array has all unique values from 1 to 9.
  Finally, the reduce function returns a boolean value based on the validity of all rows. 
  If all rows are valid, the final value of validity will be true, else it will be false.  
  */ 

  function getRow(boardArray, i) {
    //gives the string in each row
    var startingEl = Math.floor(i / 9) * 9;
    return boardArray.slice(startingEl, startingEl + 9);
    //slicing strings of length 9 and returning to boardArray
  }


  function allColumnsValid(boardArray) {
    //the array will be looped in the function and for each we'll get column (strings of length 9 vertically)
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
      return getColumn(boardArray, i);
    }).reduce(function (validity, row) {
      return collectionIsValid(row) && validity;
    }, true);
  }

  function getColumn(boardArray, i) {
    var startingEl = Math.floor(i % 9);
    //iterate from 0-9 and add the number in an array
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (num) {
      return boardArray[startingEl + num * 9];
      //num variable loops through 0-9
      /* DRYRUN: (boardArray,0) is called then 
      i)boardArray[0 + 0 * 9];
      ii)boardArray[0 + 1 * 9]; num var updated from 0 to 1 so [0,9]
      iii)boardArray[0 + 2 * 9]; num var updated from 1 to 2 so [0,18]
      iv)boardArray[0 + 3 * 9]; num var updated from 2 to 3 so [0,27]
      .......
      .......
      so for startingE1=0 we'll get string (of length 9)using indexes 0,9,27,36..,72
      similarly for startingE1=1 we'll get string (of length 9)using indexes 1,10,19,28..,73
      */
    });
  }

  function allBoxesValid(boardArray) {
    //take starting index of each box particularly
    return [0, 3, 6, 27, 30, 33, 54, 57, 60].map(function (i) {
      return getBox(boardArray, i);
    }).reduce(function (validity, row) {
      return collectionIsValid(row) && validity;
    }, true);
  }
  /*This function checks if all 9 boxes in the sudoku board are valid, meaning they contain no duplicate numbers
   from 1-9. The function does this by mapping over an array of indices representing the starting index of 
   each box (top left corner) and returning an array of the box values for each index using the getBox function. 
   Then, it reduces over this array of box values, checking if each box is valid using the collectionIsValid 
   function (which checks for duplicate values in a collection), and returning true only if all boxes are valid.
   */

   
  function getBox(boardArray, i) {
    var boxCol = Math.floor(i / 3) % 3;// for column
    var boxRow = Math.floor(i / 27);//for row-> 0,9,18 all less than 27 gives boxRow=0 -> box 0 column
    var startingIndex = boxCol * 3 + boxRow * 27;// forming a combination for each start index of a box
    //these indexes are looped over to get similar values for rest of the boxes in sudoku
    return [0, 1, 2, 9, 10, 11, 18, 19, 20].map(function (num) {
      return boardArray[startingIndex + num];
    });
    /*This code returns an array of 9 elements that represent the values in a 3x3 box of the Sudoku board.
     It takes in two parameters - boardArray, which is an array representation of the Sudoku board, and i, which 
     is the index of the starting cell of the box.
     To generate the 3x3 box, the code uses the startingIndex, which is a combination of the 
     boxCol (column index of the box) and boxRow (row index of the box). 
     It then maps over an array of 9 numbers, [0, 1, 2, 9, 10, 11, 18, 19, 20], which represent the indices 
     of the cells in the box. For each number num in the array, it gets the value of the corresponding cell 
     in boardArray by adding num to the startingIndex. The resulting array is a collection of the 9 values
     in the 3x3 box.
        
    
        DRYRUN: getBox(boardArray,0)
        startingIndex = 0 * 3 + 0 * 27=0
        num=0
          i)boardArray[0 + 0];
          ii)boardArray[0 + 1];
    */
  }
  /*The getBox function takes in the boardArray (an array representing the Sudoku board) and an 
    index i corresponding to the starting index of a box in the board.
    The function first calculates the boxCol and boxRow values based on the given index. boxCol represents
    the column index of the starting index within the box (i.e. 0, 1, or 2), and boxRow represents the row index
    of the starting index within the box (i.e. 0, 3, or 6).
    Using these values, the function then calculates the startingIndex of the box within the boardArray by adding
    the product of boxCol and 3 (since each box is 3 columns wide) with the product of boxRow and 27
    (since each row is 9 cells wide and there are 3 rows within each box).
    Finally, the function maps over an array of indices [0, 1, 2, 9, 10, 11, 18, 19, 20] to obtain the values 
    of the 9 cells within the box (starting from the startingIndex) and returns them as an array.
  */

  function collectionIsValid(collection) {
    var numCounts = {};
    //traversing the string to check if repetition is present or not
    for(var i = 0; i < collection.length; i++) {
      if (collection[i] != "-") {
        //if non-empty
        if (numCounts[collection[i]] === undefined) {
          numCounts[collection[i]] = 1;//first occurence of a number is being noted
        } else {
          return false;
          //duplicacy is found 
        }
      }
    }
    return true;
  }

  function toString(boardArray) {
    //starting index of each row in sudoku
    return [0, 9, 18, 27, 36, 45, 54, 63, 72].map(function (i) {
      return getRow(boardArray, i).join(" ");
    }).join("\n");
  }

  if (testable) {
    // These methods will be exposed publicly when testing is on.
    solver = { 
      solve: solve,
      solveAndPrint: solveAndPrint,
      recursiveSolve: recursiveSolve,
      boardIsInvalid: boardIsInvalid,
      boardIsValid: boardIsValid,
      boardIsSolved: boardIsSolved,
      getNextCellAndPossibilities: getNextCellAndPossibilities,
      getAllIntersections: getAllIntersections,
      allRowsValid: allRowsValid,
      getRow: getRow,
      allColumnsValid: allColumnsValid,
      getColumn: getColumn,
      allBoxesValid: allBoxesValid,
      getBox: getBox,
      collectionIsValid: collectionIsValid,
      toString: toString };
  } else {
    // These will be the only public methods when testing is off.
    solver = { solve: solve,
      solveAndPrint: solveAndPrint };
  }

  return solver;
}(TESTABLE);