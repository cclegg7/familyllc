package com.familyllc.recipemanager.service

import com.familyllc.recipemanager.dto.RecipeCreateDto
import com.familyllc.recipemanager.dto.RecipeDto
import com.familyllc.recipemanager.dto.RecipeUpdateDto
import com.familyllc.recipemanager.entity.Ingredient
import com.familyllc.recipemanager.entity.Instruction
import com.familyllc.recipemanager.entity.Recipe
import com.familyllc.recipemanager.exception.ResourceNotFoundException
import com.familyllc.recipemanager.repository.RecipeRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class RecipeService(private val recipeRepository: RecipeRepository) {

    fun getAllRecipes(): List<RecipeDto> {
        return recipeRepository.findAll().map { RecipeDto.fromEntity(it) }
    }

    fun getRecipeById(id: Long): RecipeDto {
        val recipe = recipeRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Recipe not found with id: $id") }
        return RecipeDto.fromEntity(recipe)
    }

    fun searchRecipes(searchTerm: String?): List<RecipeDto> {
        return if (searchTerm.isNullOrBlank()) {
            getAllRecipes()
        } else {
            recipeRepository.searchByTitleOrDescription(searchTerm).map { RecipeDto.fromEntity(it) }
        }
    }

    fun getRecipesByCategory(category: String): List<RecipeDto> {
        return recipeRepository.findByCategory(category).map { RecipeDto.fromEntity(it) }
    }

    fun getSortedRecipes(sortBy: String): List<RecipeDto> {
        val recipes = when (sortBy.lowercase()) {
            "title" -> recipeRepository.findAllByOrderByTitleAsc()
            "category" -> recipeRepository.findAllByOrderByCategoryAsc()
            "preptime" -> recipeRepository.findAllByOrderByPrepTimeAsc()
            "newest" -> recipeRepository.findAllByOrderByCreatedAtDesc()
            else -> recipeRepository.findAll()
        }
        return recipes.map { RecipeDto.fromEntity(it) }
    }

    @Transactional
    fun createRecipe(recipeCreateDto: RecipeCreateDto): RecipeDto {
        val recipe = Recipe(
            title = recipeCreateDto.title,
            description = recipeCreateDto.description,
            prepTime = recipeCreateDto.prepTime,
            cookTime = recipeCreateDto.cookTime,
            servings = recipeCreateDto.servings,
            category = recipeCreateDto.category
        )

        // Add ingredients
        recipeCreateDto.ingredients.forEach { ingredientDto ->
            val ingredient = Ingredient(
                name = ingredientDto.name,
                quantity = ingredientDto.quantity,
                unit = ingredientDto.unit
            )
            recipe.addIngredient(ingredient)
        }

        // Add instructions
        recipeCreateDto.instructions.forEach { instructionDto ->
            val instruction = Instruction(
                stepNumber = instructionDto.stepNumber,
                description = instructionDto.description
            )
            recipe.addInstruction(instruction)
        }

        val savedRecipe = recipeRepository.save(recipe)
        return RecipeDto.fromEntity(savedRecipe)
    }

    @Transactional
    fun updateRecipe(id: Long, recipeUpdateDto: RecipeUpdateDto): RecipeDto {
        val existingRecipe = recipeRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Recipe not found with id: $id") }

        // Update basic recipe information
        existingRecipe.title = recipeUpdateDto.title
        existingRecipe.description = recipeUpdateDto.description
        existingRecipe.prepTime = recipeUpdateDto.prepTime
        existingRecipe.cookTime = recipeUpdateDto.cookTime
        existingRecipe.servings = recipeUpdateDto.servings
        existingRecipe.category = recipeUpdateDto.category
        existingRecipe.updatedAt = LocalDateTime.now()

        // Clear existing ingredients and instructions
        existingRecipe.ingredients.clear()
        existingRecipe.instructions.clear()

        // Add new ingredients
        recipeUpdateDto.ingredients.forEach { ingredientDto ->
            val ingredient = Ingredient(
                name = ingredientDto.name,
                quantity = ingredientDto.quantity,
                unit = ingredientDto.unit
            )
            existingRecipe.addIngredient(ingredient)
        }

        // Add new instructions
        recipeUpdateDto.instructions.forEach { instructionDto ->
            val instruction = Instruction(
                stepNumber = instructionDto.stepNumber,
                description = instructionDto.description
            )
            existingRecipe.addInstruction(instruction)
        }

        val updatedRecipe = recipeRepository.save(existingRecipe)
        return RecipeDto.fromEntity(updatedRecipe)
    }

    @Transactional
    fun deleteRecipe(id: Long) {
        if (!recipeRepository.existsById(id)) {
            throw ResourceNotFoundException("Recipe not found with id: $id")
        }
        recipeRepository.deleteById(id)
    }
}
