
type endCallback = (didEnd: boolean, errorMsg: string) => void;
const VOTESTORAGE = "VOTE_STORAGE";

export async function getRathers(rathers_offset: number, endCallback: endCallback) {
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
      endCallback(true, "This is the end. Follow me in github 'Banacount'.");
    }

    return false
  }
}

// Add vote
export function saveVotedList(voted_list: number[]) {
  localStorage.setItem(VOTESTORAGE, JSON.stringify(voted_list));
}

export function getVotedList() {
  let getList = localStorage.getItem(VOTESTORAGE);

  if (getList === null) {
    saveVotedList([]);
    return [];
  } else {
    return getList;
  }
}
