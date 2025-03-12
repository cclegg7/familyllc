package com.familyllc.recipemanager.dto

import com.familyllc.recipemanager.entity.Recipe
import java.time.LocalDateTime

data class RecipeDto(
    val id: Long = 0,
    val title: String,
    val description: String? = null,
    val prepTime: Int? = null,
    val cookTime: Int? = null,
    val servings: Int? = null,
    val category: String? = null,
    val ingredients: List<IngredientDto> = emptyList(),
    val instructions: List<InstructionDto> = emptyList(),
    val createdAt: LocalDateTime? = null,
    val updatedAt: LocalDateTime? = null
) {
    companion object {
        fun fromEntity(recipe: Recipe): RecipeDto {
            return RecipeDto(
                id = recipe.id,
                title = recipe.title,
                description = recipe.description,
                prepTime = recipe.prepTime,
                cookTime = recipe.cookTime,
                servings = recipe.servings,
                category = recipe.category,
                ingredients = recipe.ingredients.map { IngredientDto.fromEntity(it) },
                instructions = recipe.instructions.map { InstructionDto.fromEntity(it) },
                createdAt = recipe.createdAt,
                updatedAt = recipe.updatedAt
            )
        }
    }
}

data class RecipeCreateDto(
    val title: String,
    val description: String? = null,
    val prepTime: Int? = null,
    val cookTime: Int? = null,
    val servings: Int? = null,
    val category: String? = null,
    val ingredients: List<IngredientCreateDto> = emptyList(),
    val instructions: List<InstructionCreateDto> = emptyList()
)

data class RecipeUpdateDto(
    val title: String,
    val description: String? = null,
    val prepTime: Int? = null,
    val cookTime: Int? = null,
    val servings: Int? = null,
    val category: String? = null,
    val ingredients: List<IngredientCreateDto> = emptyList(),
    val instructions: List<InstructionCreateDto> = emptyList()
)
