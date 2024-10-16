<?php

namespace App\Rules;

use App\Models\Category;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidParentCategory implements ValidationRule
{
    protected $category;

    public function __construct(Category $category)
    {
        $this->category = $category;
    }
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // If no parent is selected, we don't need to validate further
        if (is_null($value)) {
            return;
        }

        // Check if the parent_id is the same as the category being edited (category cannot be its own parent)
        if ($value == $this->category->id) {
            $fail('The category cannot be its own parent.');
            return;
        }

        // Check if the selected parent is a descendant (child, grandchild, etc.) of the current category
        if ($this->isDescendant($this->category, $value)) {
            $fail('The selected parent category is a descendant and cannot be assigned.');
        }
    }

    /**
     * Recursively check if the given parent_id is a descendant of the current category.
     *
     * @param  Category  $category
     * @param  int  $parentId
     * @return bool
     */
    protected function isDescendant(Category $category, $parentId): bool
    {
        foreach ($category->allChildren as $child) {
            if ($child->id == $parentId || $this->isDescendant($child, $parentId)) {
                return true;
            }
        }

        return false;
    }

    
}
