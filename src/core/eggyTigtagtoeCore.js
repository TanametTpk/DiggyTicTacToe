let transposition_table = {}

// validate = True is using for validate end game, If false mean get for minimax algor
function get_possible_size(current_sizes, validate) {
  const size_availables = [];
  for (let i = 0; i < 3; i++) {
    if (current_sizes[i] > 0) {
      size_availables.push(i + 1);
    }
  }

  if (validate) return size_availables;

  if (size_availables.length > 1)
    return size_availables.slice(1);

  return size_availables;
}

function find_choices(board, board_size, side, current_sizes, validate = false) {
  const available_choices = [];
  const possible_size = get_possible_size(current_sizes, validate);
  for (const p_size of possible_size) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const isOwnMark = board[row][col] === side;
        const canPlace = board_size[row][col] < p_size;
        const sizeBlock = (p_size - 1) * 9;
        const rowBlock = row * 3;
        if (!isOwnMark && canPlace) {
          available_choices.push(sizeBlock + rowBlock + col);
        }
      }
    }
  }
  return available_choices;
}

function is_board_full(board, board_size, side, current_sizes) {
  const choices = find_choices(board, board_size, side, current_sizes, true);
  const can_place_somewhere = choices.length > 0;
  return !can_place_somewhere;
}

function is_winner(player, board) {
  for (let i = 0; i < 3; i++) {
    if (board[i].every(cell => cell === player) ||
      [0, 1, 2].every(j => board[j][i] === player)) {
      return true;
    }
  }
  if ([0, 1, 2].every(i => board[i][i] === player) ||
    [0, 1, 2].every(i => board[i][2 - i] === player)) {
    return true;
  }
  return false;
}

function check_draw_win(player, board) {
  let target = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === player) {
        target++;
      }
    }
  }
  return target > 4;
}

function get_hash_board(board, board_size) {
    return Array(board).toString() + Array(board_size).toString
}

function minimax(board, board_size, X_sizes, O_sizes, depth, is_maximizing, alpha, beta) {

    // let hash_board = get_hash_board(board, board_size)
    // if (transposition_table[hash_board]) return transposition_table[hash_board]

  if (is_winner('x', board)) {
    return -1;
  }
  if (is_winner('o', board)) {
    return 1;
  }
  if (is_board_full(board, board_size, is_maximizing ? 'o' : 'x', is_maximizing ? O_sizes : X_sizes)) {
    return check_draw_win('o', board) ? 0.5 : -0.5;
  }

  if (is_maximizing) {
    let max_evalue = -Infinity;
    const possible_choices = find_choices(board, board_size, 'o', O_sizes);
    for (const p_choice of possible_choices) {
      const select_size = Math.floor(p_choice / 9) + 1;
      const slot = p_choice % 9;
      const row = Math.floor(slot / 3);
      const col = slot % 3;

      const prev_size = board_size[row][col];
      const prev_side = board[row][col];

      board[row][col] = 'o';
      board_size[row][col] = select_size;
      O_sizes[select_size - 1] -= 1;
      const evalue = minimax(board, board_size, X_sizes, O_sizes, depth + 1, false, alpha, beta);

      board[row][col] = prev_side;
      board_size[row][col] = prev_size;
      O_sizes[select_size - 1] += 1;

      max_evalue = Math.max(max_evalue, evalue);
      alpha = Math.max(alpha, evalue);
      if (beta <= alpha) break;
    }

    transposition_table[get_hash_board(board, board_size)] = max_evalue
    return max_evalue;
  } else {
    let min_evalue = Infinity;
    const possible_choices = find_choices(board, board_size, 'x', X_sizes);
    for (const p_choice of possible_choices) {
      const select_size = Math.floor(p_choice / 9) + 1;
      const slot = p_choice % 9;
      const row = Math.floor(slot / 3);
      const col = slot % 3;

      const prev_size = board_size[row][col];
      const prev_side = board[row][col];

      board[row][col] = 'x';
      board_size[row][col] = select_size;
      X_sizes[select_size - 1] -= 1;
      const evalue = minimax(board, board_size, X_sizes, O_sizes, depth + 1, true, alpha, beta);

      board[row][col] = prev_side;
      board_size[row][col] = prev_size;
      X_sizes[select_size - 1] += 1;

      min_evalue = Math.min(min_evalue, evalue);
      beta = Math.min(beta, evalue);
      if (beta <= alpha) break;
    }

    transposition_table[get_hash_board(board, board_size)] = min_evalue
    return min_evalue;
  }
}

export default function find_best_move(board, board_size, X_sizes, O_sizes) {
  let best_move = null;
  let best_evalue = -Infinity;
  let alpha = -Infinity;
  let beta = Infinity;
  const possible_choices = find_choices(board, board_size, 'o', O_sizes);
  console.log(O_sizes);
  console.log(possible_choices);
  const evalue_best_choices = [];
  const more_best_choices = [];
  for (const p_choice of possible_choices) {
    const select_size = Math.floor(p_choice / 9) + 1;
    const slot = p_choice % 9;
    const row = Math.floor(slot / 3);
    const col = slot % 3;

    const prev_size = board_size[row][col];
    const prev_side = board[row][col];

    board[row][col] = 'o';
    board_size[row][col] = select_size;
    O_sizes[select_size - 1] -= 1;
    const evalue = minimax(board, board_size, X_sizes, O_sizes, 0, false, alpha, beta);
    evalue_best_choices.push(evalue);
    console.log(evalue);

    const is_instance_win = is_winner('o', board);

    board[row][col] = prev_side;
    board_size[row][col] = prev_size;
    O_sizes[select_size - 1] += 1;
    more_best_choices.push([row, col, select_size]);

    if (is_instance_win) {
      best_move = [row, col, select_size];
      return best_move;
    }

    if (evalue > best_evalue) {
      best_evalue = evalue;
      best_move = [row, col, select_size];
    }
  }

  const filtered_best_choices = [];
  for (let i = 0; i < evalue_best_choices.length; i++) {
    if (best_evalue === evalue_best_choices[i]) {
      filtered_best_choices.push(more_best_choices[i]);
    }
  }

  if (filtered_best_choices.length > 1) {
    const randomIndex = Math.floor(Math.random() * filtered_best_choices.length);
    return filtered_best_choices[randomIndex];
  }

  return best_move;
}