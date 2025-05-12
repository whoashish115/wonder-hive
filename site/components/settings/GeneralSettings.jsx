import useStore from "@/hooks/useStore";
import React from "react";
import Switch from "../customs/Switch";
import { toggleGlimpseSound, toggleMessageSound, toggleNotifySound,togglePostSound } from "@/store/actions/globalActions/settingsActions";

const GeneralSettings = () => {
  const { state, dispatch } = useStore();
  const {notifySound, messageSound, glimpseSound} = state.settings
  return (
    <div className="bg-background-light rounded-custom w-full p-8 gap-8 flex flex-col">
      <h5 className="text-xl">General</h5>

      <div className="flex-col flex gap-2">
        <div className="flex item-center flex-grow justify-between">
          <div className="text-text-light flex-grow w-full ">Notify Sound</div>

          <div>
            <Switch enabled={notifySound} handleToggle={()=>toggleNotifySound(state, dispatch)}/>
          </div>
        </div>
      </div>

      <div className="flex-col flex gap-2">
        <div className="flex item-center flex-grow justify-between">
          <div className="text-text-light flex-grow w-full ">Message Sound</div>
          <div>
            <Switch enabled={messageSound} handleToggle={()=>toggleMessageSound(state, dispatch)}/>
          </div>
        </div>
      </div>
      <div className="flex-col flex gap-2">
        <div className="flex item-center flex-grow justify-between">
          <div className="text-text-light flex-grow w-full ">Autoplay Glimpses Sound</div>
          <div>
            <Switch enabled={glimpseSound} handleToggle={()=>toggleGlimpseSound(state, dispatch)}/>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default GeneralSettings;
