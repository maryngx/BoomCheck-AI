import { useDrag } from "react-dnd";

const ChemicalBox = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "chemical",
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`m-2 px-4 py-2 bg-gray-100 rounded-lg shadow text-sm font-medium border  
        ${isDragging ? "opacity-30" : "opacity-100"} cursor-move`}
    >
      🧪 {name}
    </div>
  );
};

export default ChemicalBox;
