'use client'

import useAuth from "@/hooks/use-auth";
import useProfile from "@/hooks/use-profile";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AiFillInfoCircle, AiOutlineInfoCircle } from "react-icons/ai";
import FollowButton from "../follow-button";
import ProfilePicture from "../images/profile-picture";
import AccountLabel from "../labels/account-label";
import TimeLabel from "../labels/time-label";

interface ProfileHeaderProps {
    id: number,
    setLikesTab?: Dispatch<SetStateAction<boolean>>,
}

export default function ProfileHeader({ id, setLikesTab }: ProfileHeaderProps) {
    const data = useProfile(id)
    const auth = useAuth()

    const [showStats, setShowStats] = useState(false)
    const [clientFollow, setClientFollow] = useState(false)

    useEffect(() => { 
        if (data !== undefined) if (setLikesTab) setLikesTab(data.likesVisible || (!data.likesVisible && auth === id))
    }, [data, auth, id, setLikesTab])


    if (data === undefined) return (
        <div className="flex items-center justify-center text-2xl font-semibold">Encountered error fetching profile</div>
    )
    else return (
        <div className="w-full">
            <div className="w-full aspect-[13/3] bg-emerald-800"/>
            <div className="w-full relative flex p-2 gap-2">
                <div className="bg-gray-900 rounded-full p-1 w-fit relative -top-12 flex-shrink-0">
                    <ProfilePicture userId={id} profileData={data} sizeOverride={10}/>
                </div>
                <div className="flex flex-col">
                    <AccountLabel text={data.displayName} size='extra_large' displayName/>
                    <AccountLabel text={data.accountName} size='extra_large'/>
                    <div className="break-all relative top-4 text-gray-200">{data.bio}</div>
                </div>
                <div className="absolute top-36 left-3"><FollowButton id={id} followed={data.followed} onChange={setClientFollow}/></div>
            </div>

            <div className="flex px-3 py-4 items-end">
                <span className="font-bold pe-1 text-lg">{data.followerCount + (clientFollow === data.followed ? 0 : clientFollow ? 1 : -1)}</span>
                <span className="text-gray-500 text-lg pe-3">Followers</span>

                <span className="font-bold pe-1 text-lg">{data.followedCount}</span>
                <span className="text-gray-500 text-lg pe-3">Followed</span>

                {showStats
                    ? <AiFillInfoCircle className="text-xl inset-y-0 my-auto cursor-pointer hover:text-gray-500 duration-200" onClick={() => setShowStats(false)}/>
                    : <AiOutlineInfoCircle className="text-xl text-gray-500 inset-y-0 my-auto cursor-pointer hover:text-white duration-200" onClick={() => setShowStats(true)}/>}

                <div className="flex-1 flex justify-end h-fit">
                    <TimeLabel mode='date' date={new Date(data.dateCreated)} prefix="Joined"/>
                </div>
            </div>

            <div className={`${!showStats ? 'h-0' : 'h-24 xs:h-28'} text-sm xs:text-base overflow-hidden duration-200`}>
                <div className={`p-2 grid grid-rows-4 grid-cols-7 grid-flow-col overflow-hidden bg-black/20`}>
                    <div className="col-span-3">
                        <span className={`font-bold pe-1 text-gray-500 ${data.runningResponseScore > 0 && 'text-green-600'} ${data.runningResponseScore < 0 && 'text-red-600'}`}>{data.runningResponseScore > 0 && '+'}{data.runningResponseScore}</span>
                        <span className="text-gray-500 pe-3">Response score</span>
                    </div>
                    <div className="col-span-3">
                        <span className={`font-bold pe-1 text-gray-500 ${data.netPositiveResponses > 0 && 'text-green-300'}`}>{data.netPositiveResponses}</span>
                        <span className="text-gray-500 pe-3">Positive responses</span>
                    </div>
                    <div className="col-span-3">
                        <span className={`font-bold pe-1 text-gray-500 ${data.netPositiveResponses > 0 && 'text-red-300'}`}>{data.netNegativeResponses}</span>
                        <span className="text-gray-500 pe-3">Negative responses</span>
                    </div>
                    <div className="col-span-3">
                        <span className={`font-bold pe-1 text-gray-500 ${data.netPositiveResponses > 0 && 'text-yellow-600'}`}>{data.bestResponses}</span>
                        <span className="text-gray-500 pe-3">Best responses</span>
                    </div>

                    <div className="col-span-2">
                        <span className='font-bold pe-1'>{data.blogPostCount}</span>
                        <span className="text-gray-500 pe-3">Blog posts</span>
                    </div>
                    <div className="col-span-2">
                        <span className='font-bold pe-1'>{data.replyCount}</span>
                        <span className="text-gray-500 pe-3">Replies</span>
                    </div>
                    <div className="col-span-2">
                        <span className='font-bold pe-1'>{data.adviceCount}</span>
                        <span className="text-gray-500 pe-3">Advice posts</span>
                    </div>
                    <div className="col-span-2">
                        <span className='font-bold pe-1'>{data.responseCount}</span>
                        <span className="text-gray-500 pe-3">Responses</span>
                    </div>

                    <div className="col-span-2">
                        <span className='font-bold pe-1'>{data.ownedPetCount}</span>
                        <span className="text-gray-500 pe-3">Owned pets</span>
                    </div>
                </div>
            </div>
        </div>
    )
}