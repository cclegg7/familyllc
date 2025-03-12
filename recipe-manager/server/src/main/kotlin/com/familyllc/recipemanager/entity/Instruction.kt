package com.familyllc.recipemanager.entity

import jakarta.persistence.*

@Entity
@Table(name = "instructions")
data class Instruction(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(name = "step_number", nullable = false)
    var stepNumber: Int,
    
    @Column(columnDefinition = "TEXT", nullable = false)
    var description: String,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    var recipe: Recipe? = null
)
