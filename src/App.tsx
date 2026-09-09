import { useEffect, useState } from 'react'
import { getRathers, saveVotedList, calcOperation, getVotedList, addVoteToServer } from './utils';
import './App.css'
import './Responsive.css'

// Global variables and types
let rathers_offset = 0;
let ratherOffsetSize = 5;
let isFirstTime = true;
let didGetRathers = false;
let didEnd = false, didRevealPercentage = false;
let errorMsg = "Error :(";
let votedRathersList: number[] = [];

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
  const [right_percentage, setRightPercentage] = useState("");
  const [left_percentage, setLeftPercentage] = useState("");

  // element states
  const [coverState, setCoverState] = useState("open");
  const [endState, setEndState] = useState("");
  const [centerText, setCenterText] = useState("");

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
      }
      else {
        setRight(errorMsg);
        setLeft(errorMsg);
      }
    }

    if (view_rather_index >= ratherOffsetSize) 
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
    let isPopulated = (rather_list.length > 0);
    let isLessThanMaxOffset = (view_rather_index < ratherOffsetSize);

    if (isPopulated && isLessThanMaxOffset) 
    {
      setRight(rather_list[view_rather_index].right_rather);
      setLeft(rather_list[view_rather_index].left_rather);

      if (didGetRathers) setCoverState("open");
    }
  }
  , [rather_list, view_rather_index]);

  // Handle the voting event
  const handleVote = (vote_direction: string) => {
    if (didEnd || !didGetRathers) return;
    let alreadyVoted = false;

    votedRathersList = getVotedList();
    let getRather = rather_list[view_rather_index];

    for (let i = 0; i < votedRathersList.length; i++) {
      if (votedRathersList[i] == getRather.id_index)
        alreadyVoted = true;
    }

    if (!alreadyVoted) {
      votedRathersList.push(getRather.id_index);
      saveVotedList(votedRathersList);
      addVoteToServer(getRather.id_index, vote_direction);
      console.log(`You voted ${vote_direction}.`);
    }

    if (view_rather_index < ratherOffsetSize) {
      // Close and process next rather
      if (didRevealPercentage) {
        setCoverState("close")
        setRatherIndex(view_rather_index + 1);
        setRightPercentage("");
        setLeftPercentage("");
        setCenterText("");
        didRevealPercentage = false;
        return;
      }

      // Calculate percentage of votes
      if (didRevealPercentage) return;

      let 
        l_votes = rather_list[view_rather_index].total_left_votes, 
        r_votes = rather_list[view_rather_index].total_right_votes;

      if (vote_direction == "left" && !alreadyVoted) l_votes++;
      if (vote_direction == "right" && !alreadyVoted) r_votes++;

      let 
        sum_votes = (l_votes + r_votes),
        right_side_calc = calcOperation((r_votes / sum_votes) * 100), 
        left_side_calc = calcOperation((l_votes / sum_votes) * 100);

      setRightPercentage(`${right_side_calc}%`);
      setLeftPercentage(`${left_side_calc}%`);
      setCenterText("Click anywhere again to continue");
      didRevealPercentage = true;
    }
  };

  return (
    <>
      <div className="ui-contain">
        <div className={`ending-text ${endState}`}>{errorMsg}</div>
        <div className={`next-cover ${coverState}`}></div>

        <div className='centered-ui'>
          <p className={`next-text ${centerText == "" ? 'close-next' : 'open-next'}`}>{centerText}</p>
          <button className="add-rather-btn">?</button>
        </div>

        <div className='rather-contain'>
          <div className='left-side side' onClick={() => handleVote("left")}>
            {left_text}
            <p>{left_percentage}</p>
          </div>

          <p className='middle-text'>OR</p>

          <div className='right-side side' onClick={() => handleVote("right")}>
            {right_text}
            <p>{right_percentage}</p>
          </div>
        </div>

      </div>
    </>
  )
}

export default App
