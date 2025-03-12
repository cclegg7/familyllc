package com.familyllc.recipemanager.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "recipes")
data class Recipe(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    var title: String,
    
    @Column(columnDefinition = "TEXT")
    var description: String? = null,
    
    @Column(name = "prep_time")
    var prepTime: Int? = null,
    
    @Column(name = "cook_time")
    var cookTime: Int? = null,
    
    var servings: Int? = null,
    
    var category: String? = null,
    
    @OneToMany(mappedBy = "recipe", cascade = [CascadeType.ALL], orphanRemoval = true)
    var ingredients: MutableList<Ingredient> = mutableListOf(),
    
    @OneToMany(mappedBy = "recipe", cascade = [CascadeType.ALL], orphanRemoval = true)
    @OrderBy("stepNumber ASC")
    var instructions: MutableList<Instruction> = mutableListOf(),
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    // Helper methods to maintain bidirectional relationship
    fun addIngredient(ingredient: Ingredient) {
        ingredients.add(ingredient)
        ingredient.recipe = this
    }
    
    fun removeIngredient(ingredient: Ingredient) {
        ingredients.remove(ingredient)
        ingredient.recipe = null
    }
    
    fun addInstruction(instruction: Instruction) {
        instructions.add(instruction)
        instruction.recipe = this
    }
    
    fun removeInstruction(instruction: Instruction) {
        instructions.remove(instruction)
        instruction.recipe = null
    }
}
