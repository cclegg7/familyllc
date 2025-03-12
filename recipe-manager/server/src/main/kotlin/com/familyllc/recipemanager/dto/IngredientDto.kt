package com.familyllc.recipemanager.dto

import com.familyllc.recipemanager.entity.Ingredient

data class IngredientDto(
    val id: Long = 0,
    val name: String,
    val quantity: String? = null,
    val unit: String? = null
) {
    companion object {
        fun fromEntity(ingredient: Ingredient): IngredientDto {
            return IngredientDto(
                id = ingredient.id,
                name = ingredient.name,
                quantity = ingredient.quantity,
                unit = ingredient.unit
            )
        }
    }
}

data class IngredientCreateDto(
    val name: String,
    val quantity: String? = null,
    val unit: String? = null
)
