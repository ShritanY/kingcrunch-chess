# KingCrunch Chess Coach

A small daily chess training app: a guided session each day, a phase plan, and game reviews run by Stockfish on your phone. Games and ratings load from chess.com's public data.

Open the site in Safari on your iPhone and tap Share > Add to Home Screen.

Not affiliated with Chess.com.

## Engine

Game reviews run Stockfish 18 (lite, single-threaded build from the `stockfish` npm package, GPL-3.0) in the browser, with Stockfish 10 (`stockfish.js`) as a fallback for devices that can't run WebAssembly. Stockfish source: https://github.com/official-stockfish/Stockfish

## Chess pieces

The pieces are the "Standard" set from Wikimedia Commons by Cburnett and Rfc1394, taken from the cm-chessboard project, licensed CC BY-SA 3.0: https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces/Standard
