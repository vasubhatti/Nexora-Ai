const CreditBadge = ({ creditsUsed, remainingCredits }) => {
  if (!creditsUsed) return null;

  return (
    <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
      <span>Used: <span className="text-zinc-400">{creditsUsed} credits</span></span>
      <span>·</span>
      <span>Remaining: <span className="text-zinc-400">{remainingCredits} credits</span></span>
    </div>
  );
};

export default CreditBadge;