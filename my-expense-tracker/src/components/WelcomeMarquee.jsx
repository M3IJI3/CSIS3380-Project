import React from 'react';
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

const reviews = [
    {
        name: "Alice Green",
        username: "@alice",
        body: "This app makes budgeting and tracking expenses incredibly easy and effective. Highly recommend it!",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight2&accessoriesType=Blank&hairColor=Blonde&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light",
    },
    {
        name: "Michael Johnson",
        username: "@michael",
        body: "A must-have tool for anyone looking to manage their finances and save money efficiently.",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Blank&hairColor=Brown&facialHairType=Blank&clotheType=Hoodie&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light",
    },
    {
        name: "Sophia Brown",
        username: "@sophia",
        body: "Great tool for keeping track of daily expenses and managing budgets. Simple and powerful.",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=Brown&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light",
    },
    {
        name: "David Williams",
        username: "@david",
        body: "The best budgeting app I’ve used. It’s intuitive, user-friendly, and extremely helpful in saving money.",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairDreads01&accessoriesType=Blank&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Brown",
    },
    {
        name: "Emma Davis",
        username: "@emma",
        body: "Keeps my spending in check and helps me save more every month. Fantastic app for budgeting.",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurly&accessoriesType=Blank&hairColor=Blonde&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light",
    },
    {
        name: "Daniel Wilson",
        username: "@daniel",
        body: "Highly recommend for those who want to stay on top of their finances and track spending.",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Blank&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Brown",
    },
    {
        name: "Olivia Martinez",
        username: "@olivia",
        body: "Perfect for financial planning and managing expenses. The app is easy to use and very effective.",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairFro&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light",
    },
    {
        name: "James Garcia",
        username: "@james",
        body: "Helps me save more each month by providing insights into my spending habits. Excellent tool!",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairSides&accessoriesType=Blank&hairColor=Blonde&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light",
    },
    {
        name: "Isabella Robinson",
        username: "@isabella",
        body: "Amazing app for daily expenses and budget management. It’s a game-changer for personal finance.",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraightStrand&accessoriesType=Blank&hairColor=Blonde&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light",
    },
    {
        name: "William Clark",
        username: "@william",
        body: "Simple yet powerful budgeting tool that makes managing money effortless and stress-free. Love it!",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairTheCaesar&accessoriesType=Blank&hairColor=Brown&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light",
    },
    {
        name: "Mia Rodriguez",
        username: "@mia",
        body: "Makes managing money effortless and provides great features for tracking costs and saving money.",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairBigHair&accessoriesType=Blank&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Brown",
    },
    {
        name: "Ethan Lewis",
        username: "@ethan",
        body: "Excellent app for tracking costs and managing budgets. Highly effective and user-friendly interface.",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortRound&accessoriesType=Blank&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Brown",
    },
    {
        name: "Ava Lee",
        username: "@ava",
        body: "Great design and functionality, making it a top choice for anyone needing financial management tools.",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=Brown&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light",
    },
    {
        name: "Lucas Walker",
        username: "@lucas",
        body: "Very user-friendly and effective in helping me manage my finances and stick to my budget.",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Blank&hairColor=Brown&facialHairType=Blank&clotheType=Hoodie&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light",
    },
    {
        name: "Charlotte Hall",
        username: "@charlotte",
        body: "Essential for budget-conscious users who want to keep their spending in check and save money.",
        img: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=Brown&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light",
    },
];



const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
    return (
        <figure
            className={cn(
                "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
};

const MarqueeDemo = () => {
    return (
        <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
            <Marquee pauseOnHover className="[--duration:20s]">
                {firstRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
                {secondRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
    );
}

export default MarqueeDemo;
