// import { DeviceMobileIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { Image } from "@chakra-ui/react";
import React, { useRef } from "react";

function PixInsertModal(props: any) {
  const filePickerRef = useRef(null);

  const { pixToPost } = props;

  return (
    <div className="bg-white mx-5 border-2 rounded-lg ">
      <div
        className="bg-gray-100 hover:bg-gray-200 cursor-pointer
        relative rounded-lg m-3 h-44 text-xl text-gray-500">
        <Image h={"64"} w={"72"} src={pixToPost} alt="pix" />
      </div>
    </div>
  );
}

export default PixInsertModal;
