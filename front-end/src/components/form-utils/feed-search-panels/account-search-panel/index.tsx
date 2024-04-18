'use client'

import AccountFetchOptions from "@/helpers/fetch-options/account-fetch-options";
import { useForm } from "react-hook-form";
import { AiOutlineSearch } from "react-icons/ai";
import Input from "../../input";
import Select from "../../select";

interface AccountSearchPanelProps {
    onSave: (options: AccountFetchOptions) => void,
    defaults?: AccountFetchOptions,
}

export default function AccountSearchPanel({ onSave, defaults }: AccountSearchPanelProps) {
    // const [minimized, setMinimized] = useState(true)

    const {
        register,
        handleSubmit,
    } = useForm<AccountFetchOptions>()

    return (
        <form className='flex w-full h-fit flex-col'>
            <div className='grid grid-cols-7 grid-rows-2 w-full h-28 rounded-lg border border-zinc-700 bg-gray-700/20'>
                <div className="w-full h-full col-span-7 p-2 relative flex items-center justify-center">
                    <Input defaultValue={defaults?.contains} register={register} name='contains' placeholder="What are you looking for?" className="w-full" />
                    <AiOutlineSearch className="text-gray-400 inset-y-0 my-auto absolute right-4 text-2xl cursor-pointer hover:text-white duration-200" onClick={handleSubmit(data => onSave(data))}/>
                </div>
                
                <div className="col-span-3 w-full h-full p-2 flex gap-2 items-center">
                    <p>Order by:</p>
                    <div className="flex-1">
                        <Select register={register} name='orderBy' options={new Map([
                            ['account_name', 'Account name'],
                            ['display_name', 'Display name'],
                            ['follower_count', 'Followers'],
                            ['followed_count', 'Follows'],
                            ['date_created', 'Join date'],
                            ['running_response_score', 'Response score'],
                            ['net_positive_responses', 'Posititve responses'],
                            ['net_negative_responses', 'Negative responses'],
                            ['best_responses', 'Best responses'],
                            ['blog_post_count', 'Blog posts'],
                            ['reply_count', 'Replies'],
                            ['advice_count', 'Advice posts'],
                            ['response_count', 'Responses'],
                            ['owned_pet_count', 'Pets'],
                            ['date_followed', 'Follow date'],
                        ])} def={defaults?.orderBy === undefined ? 'like_count' : defaults.orderBy}/>
                    </div>
                </div>

                <div className="col-span-3 w-full h-full p-2 flex gap-2 items-center">
                    <p>Direction:</p>
                    <div className="flex-1">
                        <Select register={register} name='orderMode' options={new Map([
                            ['DESC', 'Descending'],
                            ['ASC', 'Ascending'],
                        ])} def={defaults?.orderMode === undefined ? 'DESC' : defaults.orderMode}/>
                    </div>
                </div>
            </div>
            
            {/* ADVANCED SEARCH: POTENTIAL TBA */}
        </form>
    )
}