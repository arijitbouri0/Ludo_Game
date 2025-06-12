
import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ArrowIcon from "../../constants/ArrowIcon";
import StarIcon from "../../constants/StarIcon";
import type { RootState } from "../../redux/store";
import LudoPiece from "./LudoPiece";

interface ArrowPosition {
  id: string;
  direction: "up" | "down" | "left" | "right";
}

interface TeamPathProps {
  teamColor: "red" | "green" | "blue" | "yellow";
  handleMove: (id: string) => void;
}

const pathConfig: Record<
  TeamPathProps["teamColor"],
  {
    layout: "vertical" | "horizontal";
    pathTileIds: string[];
    homeTileIds: string[];
    starTileIds: string[];
    arrowTilePositions: ArrowPosition[];
  }
> = {
  red: {
    layout: "horizontal",
    pathTileIds: [
      "B13",
      "R1",
      "R2",
      "R3",
      "R4",
      "R5",
      "B12",
      "Rh1",
      "Rh2",
      "Rh3",
      "Rh4",
      "Rh5",
      "B11",
      "B10",
      "B9",
      "B8",
      "B7",
      "B6",
    ],
    homeTileIds: ["R1", "Rh1", "Rh2", "Rh3", "Rh4", "Rh5"],
    starTileIds: ["R1", "B9"],
    arrowTilePositions: [{ id: "B12", direction: "left" }],
  },
  green: {
    layout: "vertical",
    pathTileIds: [
      "R11",
      "R12",
      "R13",
      "R10",
      "Gh1",
      "G1",
      "R9",
      "Gh2",
      "G2",
      "R8",
      "Gh3",
      "G3",
      "R7",
      "Gh4",
      "G4",
      "R6",
      "Gh5",
      "G5",
    ],
    homeTileIds: ["G1", "Gh1", "Gh2", "Gh3", "Gh4", "Gh5"],
    starTileIds: ["G1", "R9"],
    arrowTilePositions: [{ id: "R12", direction: "up" }],
  },
  blue: {
    layout: "vertical",
    pathTileIds: [
      "B5",
      "Bh5",
      "Y6",
      "B4",
      "Bh4",
      "Y7",
      "B3",
      "Bh3",
      "Y8",
      "B2",
      "Bh2",
      "Y9",
      "B1",
      "Bh1",
      "Y10",
      "Y13",
      "Y12",
      "Y11",
    ],
    homeTileIds: ["B1", "Bh1", "Bh2", "Bh3", "Bh4", "Bh5"],
    starTileIds: ["B1", "Y9"],
    arrowTilePositions: [{ id: "Y12", direction: "down" }],
  },
  yellow: {
    layout: "horizontal",
    pathTileIds: [
      "G6",
      "G7",
      "G8",
      "G9",
      "G10",
      "G11",
      "Yh5",
      "Yh4",
      "Yh3",
      "Yh2",
      "Yh1",
      "G12",
      "Y5",
      "Y4",
      "Y3",
      "Y2",
      "Y1",
      "G13",
    ],
    homeTileIds: ["Y1", "Yh1", "Yh2", "Yh3", "Yh4", "Yh5"],
    starTileIds: ["Y1", "G9"],
    arrowTilePositions: [{ id: "G12", direction: "right" }],
  },
};

const TeamPath: React.FC<TeamPathProps> = ({ teamColor, handleMove }) => {
  const { layout, pathTileIds, homeTileIds, starTileIds, arrowTilePositions } =
    pathConfig[teamColor];
  const tileClass =
    "flex justify-center items-center sm:min-w-[30px] sm:min-h-[30px] border border-black";

  const playerPieces = useSelector((state: RootState) => state.localGame.playerPieces);
  const allTileIds = [...pathTileIds];

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPieces, setModalPieces] = useState<typeof playerPieces>([]);
  const [modalTileId, setModalTileId] = useState<string>("");

  const openModal = (pieces: typeof playerPieces, tileId: string) => {
    setModalPieces(pieces);
    setModalTileId(tileId);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <>
      <div
        className={`grid border border-black ${
          layout === "vertical" ? "grid-cols-3 grid-rows-6" : "grid-cols-6 grid-rows-3"
        }`}
      >
        {allTileIds.map((tileId) => {
          const isHome = homeTileIds.includes(tileId);
          const isStar = starTileIds.includes(tileId);
          const arrow = arrowTilePositions.find((a) => a.id === tileId);
          const piecesHere = playerPieces.filter((piece) => piece.position === tileId);

          const maxPiecesToShow = 1;
          const extraCount = piecesHere.length - maxPiecesToShow;

          return (
            <div
              key={tileId}
              id={tileId}
              className={`relative ${tileClass} flex flex-wrap justify-center items-center gap-1 cursor-pointer ${
                isHome ? `bg-${teamColor}-500` : ""
              }`}
              onClick={() => {
                if (piecesHere.length > maxPiecesToShow) {
                  openModal(piecesHere, tileId);
                }
              }}
              title={
                piecesHere.length > maxPiecesToShow
                  ? `Click to view all pieces (${piecesHere.length})`
                  : undefined
              }
            >
              {isStar && <StarIcon />}
              {arrow && <ArrowIcon direction={arrow.direction} />}
              {piecesHere.slice(0, maxPiecesToShow).map((piece) => (
                <LudoPiece
                  key={piece.pieceId}
                  color={piece.team}
                  id={piece.pieceId}
                  pieceMove={handleMove}
                />
              ))}
              {extraCount > 0 && (
                <div
                  className="absolute z-20 top-0 right-0 w-5 h-5 flex justify-center items-center rounded-full bg-gray-800 text-white text-xs font-bold"
                >
                  +{extraCount}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={modalOpen} onClose={closeModal} className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
        <Dialog.Panel className="bg-white rounded p-4 max-w-[200px] w-full h-[70px] shadow-sm">
          <div className="flex flex-wrap gap-6 p-2  overflow-auto">
            {modalPieces.map((piece) => (
              <div
                key={piece.pieceId}
                onClick={() => {
                  handleMove(piece.pieceId);
                  closeModal();
                }}
                className="cursor-pointer"
              >
                <LudoPiece color={piece.team} id={piece.pieceId} pieceMove={handleMove} />
              </div>
            ))}
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default TeamPath;

