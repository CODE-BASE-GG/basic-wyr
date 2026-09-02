import { useEffect, useState } from 'react'
import './App.css'

// Global variables and types
let rathers_offset = 5;
let isFirstTime = true;
let didGetRathers = false;
let didEnd = false;
let errorMsg = "Error :(";
interface RatherObject {
  _id: string,
  id_index: number,
  left_rather: string,
  right_rather: string,
  total_left_votes: number,
  total_right_votes: number,
  date: string,
}

function App() {
  const [rather_list, setRathers] = useState<RatherObject[]>([]);
  const [view_rather_index, setRatherIndex] = useState(0);

  const [right_text, setRight] = useState("Loading..");
  const [left_text, setLeft] = useState("Loading..");


  // Fetch the would you rather datas
  useEffect(() => 
  {
    const fetchRathers = async () => {
      const requestRathers = await getRathers();

      if (requestRathers) {
        setRathers(requestRathers);
        setRatherIndex(0);
        didGetRathers = true;
      }
      else {
        setRight(errorMsg);
        setLeft(errorMsg);
      }

    }


    if (view_rather_index >= 4) 
    {
      didGetRathers = false;
      rathers_offset++;
      fetchRathers();
    } 
    else if (isFirstTime) 
    {
      fetchRathers();
      isFirstTime = false;
    }
  }
  , [view_rather_index]);

  // If the rather_list changes it updates the texts
  useEffect(() => 
  {
    if (rather_list.length > 0) {
      setRight(rather_list[view_rather_index].right_rather);
      setLeft(rather_list[view_rather_index].left_rather);
    }
  }
  , [rather_list, view_rather_index]);

  const handleVote = (vote: string) => {
    if (didEnd) return;

    console.log(`You voted ${vote}.`);

    if (view_rather_index < 4) {
      setRatherIndex(view_rather_index + 1);
    }
  };

  return (
    <>
      <div className="ui-contain">

        <div className='rather-contain'>
          <div className='left-side' onClick={() => handleVote("left")}>
            {left_text}
          </div>

          <p className='middle-text'>OR</p>

          <div className='right-side' onClick={() => handleVote("right")}>
            {right_text}
          </div>
        </div>

      </div>
    </>
  )
}

async function getRathers() {
  try {
    const url = `https://basic-would-you-rather-api.vercel.app/rathers/get/${rathers_offset}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status == 400) {
        const data = await response.json();
        throw new Error(data.message);
      } 
      else {
        throw new Error(`Request status ${response.status}.`);
      }
    }

    const to_json = await response.json();

    // Check if valid request
    if (!to_json.isSuccess) {
      throw new Error(to_json.message);
    }

    return to_json.rathers;
  } catch (err) {
    console.error(String(err));
    
    if (String(err) === "Error: You're skipping too much fam")
    {
      didEnd = true;
      errorMsg = "This is the end. Follow me in github 'Banacount'.";
    }

    return false
  }
}

export default App
