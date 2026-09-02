import { useEffect, useState } from 'react'
import { getRathers } from './utils';
import './App.css'

// Global variables and types
let rathers_offset = 0;
let isFirstTime = true;
let didGetRathers = false;
let didEnd = false, canVote = true;
let errorMsg = "Error :(";
let votedRathersList = [];

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
  const [right_percentage, setRightPercentage] = useState(0);
  const [left_percentage, setLeftPercentage] = useState(0);

  // element states
  const [coverState, setCoverState] = useState("open");
  const [endState, setEndState] = useState("");

  // Fetch the would you rather datas
  useEffect(() => 
  {
    const fetchRathers = async () => {
      const requestRathers = await getRathers(rathers_offset, (endBool, endMsg) => {
        didEnd = endBool;
        errorMsg = endMsg;
        setEndState("show");
      });

      if (requestRathers) {
        setRathers(requestRathers);
        setRatherIndex(0);
        didGetRathers = true;
        canVote = true;
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

      // Calculate percentage of votes
      let 
        l_votes = rather_list[view_rather_index].total_left_votes, 
        r_votes = rather_list[view_rather_index].total_right_votes;
      
      const calcOperation = (input: number) => {
        if (Number.isNaN(input)) 
          return 0;
        else if (Math.trunc(input) - input != 0) 
        {
          console.log(input);
          const format = parseFloat(input.toFixed(2))
          return format;
        }
        else 
          return Math.trunc(input);
      };

      let 
        sum_votes = (l_votes + r_votes),
        right_side_calc = calcOperation((r_votes / sum_votes) * 100), 
        left_side_calc = calcOperation((l_votes / sum_votes) * 100);

      setRightPercentage(right_side_calc);
      setLeftPercentage(left_side_calc);
      if (didGetRathers) setCoverState("open");
    }
  }
  , [rather_list, view_rather_index]);

  // Handle the voting event
  const handleVote = (vote: string) => {
    if (didEnd || !didGetRathers) return;

    console.log(`You voted ${vote}.`);

    if (view_rather_index < 4) {
      setCoverState("close")
      setRatherIndex(view_rather_index + 1);
    }
  };

  return (
    <>
      <div className="ui-contain">
        <div className={`ending-text ${endState}`}>{errorMsg}</div>
        <div className={`next-cover ${coverState}`}></div>

        <div className='rather-contain'>
          <div className='left-side side' onClick={() => handleVote("left")}>
            {left_text}
            <p>{left_percentage}%</p>
          </div>

          <p className='middle-text'>OR</p>

          <div className='right-side side' onClick={() => handleVote("right")}>
            {right_text}
            <p>{right_percentage}%</p>
          </div>
        </div>

      </div>
    </>
  )
}

export default App
