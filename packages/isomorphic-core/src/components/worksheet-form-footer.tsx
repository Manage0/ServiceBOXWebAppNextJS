import { Button } from "rizzui";
import cn from "../utils/class-names";

interface WorksheetFormFooterProps {
  className?: string;
  altBtnText?: string;
  submitBtnText?: string;
  isLoading?: boolean;
  handleAltBtn?: () => void;
}

export const negMargin = "-mx-4 md:-mx-5 lg:-mx-6 3xl:-mx-8 4xl:-mx-10";

export default function WorksheetFormFooter({
  isLoading,
  altBtnText = "Save as Draft",
  submitBtnText = "Submit",
  className,
  handleAltBtn,
}: WorksheetFormFooterProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 z-10 -mb-8 flex items-center justify-between gap-4 border-t bg-white px-4 py-4 md:px-5 lg:px-6 3xl:px-8 4xl:px-10 dark:bg-gray-50",
        className,
        negMargin
      )}
    >
      <div></div>
      {/*<Button
        variant="outline"
        className="w-full @xl:w-auto bg-white"
        onClick={handleAltBtn}
      >
        Bizonylat mentése sablonként
      </Button>*/}
      <div className="flex gap-4">
        {/*<Button
          variant="outline"
          className="w-full @xl:w-auto"
          onClick={handleAltBtn}
        >
          Megtekintés vázlatként
        </Button>
        <Button
          variant="outline"
          className="w-full @xl:w-auto"
          onClick={handleAltBtn}
        >
          Aláír
        </Button>*/}
        <Button
          variant="outline"
          className="w-full @xl:w-auto"
          onClick={handleAltBtn}
        >
          Mégsem
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full @xl:w-auto"
          name="save"
        >
          {submitBtnText}
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full @xl:w-auto"
          name="finalize"
        >
          {"Véglegesít"}
        </Button>
      </div>
    </div>
  );
}
